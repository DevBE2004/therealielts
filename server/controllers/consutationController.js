const { Op } = require('sequelize')
const db = require('../models')
const { client } = require('../config/redis.conf')
// const { appendToSheet } = require('../config/googleSheet')

module.exports = {
  createConsultation: async (req, res) => {
    const consultation = await db.Consultation.create({
      ...req.body,
    })
    // if (consultation) {
    //   await appendToSheet({
    //     url: req.body?.url,
    //     fullName: req.body?.name,
    //     yearOfBirth: req.body.yearOfBirth,
    //     ip:
    //       req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress || req.ip,
    //     phone: req.body?.mobile,
    //     email: req.body?.email,
    //     program: req.body?.goal,
    //     formName: req.body?.formName,
    //     difficult: req.body?.difficult,
    //     schedule: req.body?.schedule,
    //     userAgent: req.headers['user-agent'],
    //     atPlace: req.body?.atPlace,
    //   })
    // }
    await client.flushAll()
    return res.json({
      success: Boolean(consultation),
      message: Boolean(consultation) ? 'Tạo consultation thành công' : 'Tạo consultation thất bại',
    })
  },

  deleteConsultation: async (req, res) => {
    const hasExisted = await db.Consultation.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Consultation không tồn tại.')

    const consultation = await db.Consultation.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(consultation),
      message: consultation ? 'Xóa consultation thành công' : 'Xóa consultation thất bại',
    })
  },

  getConsultations: async (req, res) => {
    const { page = 1, limit = 10, sort = 'createdAt', search, name, email, mobile } = req.query
    const queries = {}

    if (search) {
      queries[Op.or] = [
        { name: { [Op.like]: `${search}%` } },
        { email: { [Op.like]: `${search}%` } },
        { mobile: { [Op.like]: `${search}%` } },
      ]
    }

    if (name) {
      queries.name = { [Op.like]: `${name}%` }
    }
    if (email) {
      queries.email = { [Op.like]: `${email}%` }
    }
    if (mobile) {
      queries.mobile = { [Op.like]: `${mobile}%` }
    }

    const cacheKey = `consultations:${JSON.stringify({
      page,
      limit,
      search,
      name,
      email,
      mobile,
      sort,
    })}`

    const cachedConsultations = await client.get(cacheKey)
    if (cachedConsultations) {
      const { data, total } = JSON.parse(cachedConsultations)
      return res.json({
        success: true,
        message: 'Lấy danh sách consultation thành công',
        data,
        total,
      })
    }

    const { count, rows: consultations } = await db.Consultation.findAndCountAll({
      where: queries,
      offset: (+page - 1) * +limit,
      limit: +limit,
      order: sort ? [[sort, 'DESC']] : [['createdAt', 'DESC']],
    })

    await client.setEx(cacheKey, 30, JSON.stringify({ data: consultations, total: count }))

    return res.json({
      success: true,
      message: 'Lấy danh sách consultation thành công',
      data: consultations,
      total: count,
    })
  },

  getConsultation: async (req, res) => {
    const { id } = req.params
    const consultation = await db.Consultation.findByPk(id)

    if (!consultation) throw new Error('Consultation không tồn tại.')

    return res.json({
      success: true,
      message: 'Lấy consultation thành công',
      data: consultation,
    })
  },

  updateConsultation: async (req, res) => {
    const hasExisted = await db.Consultation.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Consultation không tồn tại.')

    const consultation = await db.Consultation.update(
      { ...req.body },
      {
        where: { id: req.params.id },
        returning: true,
      },
    )

    return res.json({
      success: Boolean(consultation[0]),
      message: consultation[0]
        ? 'Cập nhật consultation thành công'
        : 'Cập nhật consultation thất bại',
      data: consultation[1] && consultation[1][0],
    })
  },
}
