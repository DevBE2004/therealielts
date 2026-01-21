const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')
module.exports = {
  createExamRegistration: async (req, res) => {
    const examRegistration = await db.ExamRegistration.create({
      ...req.body,
      bill: req.file.path,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(examRegistration),
      message: examRegistration ? 'đăng kí thành công' : 'đăng kí thất bại',
    })
  },
  updateExamRegistration: async (req, res) => {
    const { id } = req.params
    const hasExisted = await db.ExamRegistration.findByPk(id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const examRegistration = await db.ExamRegistration.update(
      {
        ...req.body,
        bill: req.file.path,
      },
      {
        where: { id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(examRegistration),
      message: examRegistration ? 'đăng kí thành công' : 'đăng kí thất bại',
    })
  },
  deleteExamRegistration: async (req, res) => {
    const { id } = req.params

    const hasExisted = await db.ExamRegistration.findByPk(id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const examRegistration = await db.ExamRegistration.destroy({
      where: { id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(examRegistration),
      message: examRegistration ? 'Xóa thành công' : 'Xóa thất bại',
    })
  },
  getExamRegistration: async (req, res) => {
    const { id } = req.params
    const examRegistration = await db.ExamRegistration.findByPk(id)
    return res.json({
      success: Boolean(examRegistration),
      message: examRegistration ? 'Lấy thông tin thành công' : 'Không tìm thấy thông tin',
      data: examRegistration,
    })
  },
  getExamRegistrations: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      passport,
      name,
      mobile,
      email,
      search,
      sort = 'createdAt',
      isConfirmed,
    } = req.query
    const queries = {}
    if (isConfirmed) {
      queries.isConfirmed = isConfirmed === 'true' || isConfirmed === '1' ? 1 : 0
    }
    if (passport) {
      queries.passport = passport
    }
    if (name) {
      queries.name = [Op.like, `${name}%`]
    }
    if (mobile) {
      queries.mobile = [Op.like, `${mobile}%`]
    }
    if (email) {
      queries.email = [Op.like, `${email}%`]
    }
    if (search) {
      queries[Op.or] = [
        { name: [Op.like, `${search}%`] },
        { email: [Op.like, `${search}%`] },
        { mobile: [Op.like, `${search}%`] },
      ]
    }
    const cacheKey = `examRegistrations:${JSON.stringify({
      page,
      limit,
      passport,
      name,
      mobile,
      email,
      search,
      sort,
      isConfirmed,
    })}`
    const alreadyGetAll = await client.get(cacheKey)
    if (alreadyGetAll) {
      const { data, total } = JSON.parse(alreadyGetAll)
      return res.json({
        success: true,
        message: 'got',
        data,
        total,
      })
    }
    const { count, rows: examRegistrations } = await db.ExamRegistration.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: examRegistrations, total: count }))
    return res.json({
      success: Boolean(examRegistrations),
      message: examRegistrations ? 'Lấy danh sách thành công' : 'Không tìm thấy kết quả',
      data: examRegistrations,
      total: count,
    })
  },
}
