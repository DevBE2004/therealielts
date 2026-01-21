const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')

module.exports = {
  create: async (req, res) => {
    const introduce = await db.Introduce.create({
      ...req.body,
      images1: req.files?.images1?.map(f => f.path),
      images2: req.files?.images2?.map(f => f.path),
      images3: req.files?.images3?.map(f => f.path),
      images4: req.files?.images4?.map(f => f.path),
      images5: req.files?.images5?.map(f => f.path),
      images6: req.files?.images6?.map(f => f.path),
    })
    await client.flushAll()
    return res.json({
      success: Boolean(introduce),
      message: Boolean(introduce) ? 'thành công.' : 'thất bại.',
    })
  },
  update: async (req, res) => {
    const introduce = await db.Introduce.update(
      {
        ...req.body,
        images1: req.files?.images1?.map(f => f.path),
        images2: req.files?.images2?.map(f => f.path),
        images3: req.files?.images3?.map(f => f.path),
        images4: req.files?.images4?.map(f => f.path),
        images5: req.files?.images5?.map(f => f.path),
        images6: req.files?.images6?.map(f => f.path),
      },
      { where: { id: req.params.id } },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(introduce),
      message: Boolean(introduce) ? 'thành công.' : 'thất bại.',
    })
  },
  getOne: async (req, res) => {
    const introduce = await db.Introduce.findByPk(req.params.id)
    return res.json({
      success: Boolean(introduce),
      message: Boolean(introduce) ? 'thành công.' : 'thất bại.',
      data: introduce,
    })
  },
  getAll: async (req, res) => {
    const { page = 1, limit = 10, search, sort = 'createdAt', type } = req.query
    const queries = {}
    if (type)
      queries.type = {
        [Op.like]: `${type}`,
      }
    const cacheKey = `introduce:${JSON.stringify({
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
    const { count, rows: introduce } = await db.Introduce.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: introduce, total: count }))
    return res.json({
      success: Boolean(introduce),
      message: introduce ? 'Lấy danh sách thành công' : 'Lấy danh sách thất bại',
      data: introduce,
      total: count,
    })
  },
}
