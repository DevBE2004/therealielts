const { client } = require('../config/redis.conf')
const { Op } = require('sequelize')
const db = require('../models')

module.exports = {
  create: async (req, res) => {
    const hasExisted = await db.Category.findOne({
      where: { name: req.body.name },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')
    const category = await db.Category.create({ ...req.body, icon: req.file?.path })
    await client.flushAll()
    return res.json({
      success: Boolean(category),
      message: Boolean(category) ? 'tạo thành công' : 'tạo thất bại',
    })
  },
  update: async (req, res) => {
    const hasExisted = await db.Category.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const category = await db.Category.update(
      { ...req.body, icon: req.file?.path },
      {
        where: { id: req.params.id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(category),
      message: category ? 'cập nhật thành công' : 'cập nhật thất bại',
    })
  },
  delete: async (req, res) => {
    const hasExisted = await db.Category.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const category = await db.Category.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(category),
      message: category ? 'xóa thành công' : 'xóa thất bại',
    })
  },
  getOne: async (req, res) => {
    const category = await db.Category.findByPk(req.params.id, {
      // include: { as: 'commonOfCategory', model: db.Common },
    })

    return res.json({
      success: Boolean(category),
      message: category ? 'Lấy thành công' : 'không tồn tại',
      data: category,
    })
  },
  getAll: async (req, res) => {
    const { page = 1, limit = 10, search, name, sort = 'createdAt', group } = req.query
    const queries = {}
    if (search) {
      queries.name = {
        [Op.like]: `${search}%`,
      }
    }
    if (name) {
      queries.name = {
        [Op.like]: `${name}`,
      }
    }
    if (group) {
      queries.group = {
        [Op.like]: `${group}`,
      }
    }
    const cacheKey = `categories:${JSON.stringify({
      page,
      limit,
      search,
      name,
      sort,
      group,
    })}`
    const cachedBanners = await client.get(cacheKey)
    if (cachedBanners) {
      const { data, total } = JSON.parse(cachedBanners)
      return res.json({
        success: true,
        message: 'got',
        data,
        total,
      })
    }
    const { count, rows: categories } = await db.Category.findAndCountAll({
      where: queries,
      offset: (+page - 1) * +limit,
      limit: +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
      // include: { as: 'commonOfCategory', model: db.Common },
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: categories, total: count }))

    return res.json({
      success: Boolean(categories),
      message: categories ? 'Lấy danh sách banner thành công' : 'Lấy danh sách banner thất bại',
      data: categories,
      total: count,
    })
  },
}
