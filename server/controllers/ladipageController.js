const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')

module.exports = {
  create: async (req, res) => {
    const ladiPage = await db.LadiPage.create({ ...req.body })
    await client.flushAll()
    return res.json({
      success: Boolean(ladiPage),
      message: Boolean(ladiPage) ? 'thành công.' : 'thất bại.',
    })
  },
  update: async (req, res) => {
    const ladiPage = await db.LadiPage.update({ ...req.body }, { where: { id: req.params.id } })
    await client.flushAll()
    return res.json({
      success: Boolean(ladiPage),
      message: Boolean(ladiPage) ? 'thành công.' : 'thất bại.',
    })
  },
  getOne: async (req, res) => {
    const ladiPage = await db.LadiPage.findByPk(req.params.id)
    return res.json({
      success: Boolean(ladiPage),
      message: Boolean(ladiPage) ? 'thành công.' : 'thất bại.',
      data: ladiPage,
    })
  },
  getAll: async (req, res) => {
    const { page = 1, limit = 10, search, sort = 'createdAt', type } = req.query
    const queries = {}
    if (type)
      queries.type = {
        [Op.like]: `${type}`,
      }
    const cacheKey = `ladipage:${JSON.stringify({
      limit,
      page,
      sort,
      type,
      search,
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
    const { count, rows: ladiPages } = await db.LadiPage.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: ladiPages, total: count }))
    return res.json({
      success: Boolean(ladiPages),
      message: ladiPages ? 'Lấy danh sách thành công' : 'Lấy danh sách thất bại',
      data: ladiPages,
      total: count,
    })
  },
}
