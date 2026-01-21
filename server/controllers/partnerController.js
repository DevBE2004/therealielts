const { Op } = require('sequelize')
const db = require('../models')
const { client } = require('../config/redis.conf')
module.exports = {
  createPartner: async (req, res) => {
    let images = []
    req.files.images.map(file => images.push(file.path))
    const partner = await db.Partner.create({
      ...req.body,
      images,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(partner),
      message: Boolean(partner) ? 'tạo đối tác thành công' : 'tạo đối tác thất bại',
    })
  },
  updatedPartner: async (req, res) => {
    let images = []
    req.files.images.map(file => images.push(file.path))
    const hasExisted = await db.Partner.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const partner = await db.Partner.update(
      { ...req.body, images },
      {
        where: { id: req.params.id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(partner),
      message: Boolean(partner) ? 'cập nhật đối tác thành công' : 'cập nhật đối tác thất bại',
    })
  },
  deletePartner: async (req, res) => {
    const hasExisted = await db.Partner.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const partner = await db.Partner.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(partner),
      message: Boolean(partner) ? 'xóa đối tác thành công' : 'xóa đối tác thất bại',
    })
  },
  getPartner: async (req, res) => {
    const partner = await db.Partner.findByPk(req.params.id)
    return res.json({
      success: Boolean(partner),
      message: Boolean(partner) ? 'lấy thông tin đối tác thành công' : 'không tìm thấy đối tác',
      data: partner,
    })
  },
  getPartners: async (req, res) => {
    const { page = 1, limit = 10, category, search, name, sort = 'createdAt', forWeb } = req.query
    const queries = {}
    if (search) {
      queries[Op.or] = [
        { name: { [Op.like]: `${search}%` } },
        { category: { [Op.like]: `${search}%` } },
      ]
    }
    if (name) {
      queries.name = { [Op.like]: `${name}%` }
    }
    if (category) {
      queries.category = { [Op.like]: `${category}%` }
    }
    if (forWeb) {
      queries.forWeb = { [Op.like]: forWeb }
    }
    const cacheKey = `partners:${JSON.stringify({
      page,
      limit,
      search,
      category,
      name,
      sort,
      forWeb,
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
    const { count, rows: partners } = await db.Partner.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: partners, total: count }))
    return res.json({
      success: Boolean(partners),
      message: Boolean(partners) ? 'lấy thông tin đối tác thành công' : 'không tìm thấy đối tác',
      data: partners,
      total: count,
    })
  },
}
