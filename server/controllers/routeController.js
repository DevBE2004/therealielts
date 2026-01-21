const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')

module.exports = {
  createRoute: async (req, res) => {
    const hasExisted = await db.Route.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')

    const routes = await db.Route.create(req.body)
    await client.flushAll()
    return res.json({
      success: Boolean(routes),
      message: Boolean(routes) ? 'Tạo lộ trình thành công' : 'Tạo lộ trình thất bại',
    })
  },

  updateRoute: async (req, res) => {
    const hasExisted = await db.Route.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const updatedRoute = await db.Route.update(req.body, {
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(updatedRoute),
      message: Boolean(updatedRoute)
        ? 'Cập nhật lộ trình thành công'
        : 'Cập nhật lộ trình thất bại',
    })
  },
  deleteRoute: async (req, res) => {
    const hasExisted = await db.Route.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const deletedRoute = await db.Route.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(deletedRoute),
      message: Boolean(deletedRoute) ? 'Xóa lộ trình thành công' : 'Xóa lộ trình thất bại',
    })
  },
  getRoute: async (req, res) => {
    const route = await db.Route.findOne({ where: { slug: req.params.slug } })
    return res.json({
      success: Boolean(route),
      message: Boolean(route) ? 'Lấy thông tin lộ trình thành công' : 'Lộ trình không tồn tại',
      data: route,
    })
  },
  getRoutes: async (req, res) => {
    const { page = 1, limit = 10, title, search, sort = 'createdAt' } = req.query
    const queries = {}
    if (title) {
      queries.title = { [Op.like]: `${title}%` }
    }
    if (search) {
      queries[Op.or] = [{ title: { [Op.like]: `${search}%` } }]
    }

    const cacheKey = `routes:${JSON.stringify({
      page,
      limit,
      title,
      search,
      sort,
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
    const { count, rows: routes } = await db.Route.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: routes, total: count }))
    return res.json({
      success: Boolean(routes),
      message: Boolean(routes) ? 'Lấy danh sách lộ trình thành công' : 'Không tìm thấy lộ trình',
      data: routes,
      total: count,
    })
  },
}
