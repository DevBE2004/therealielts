const { client } = require('../config/redis.conf')
const { Op } = require('sequelize')
const db = require('../models')

module.exports = {
  create: async (req, res) => {
    const newPage = await db.PageContents.create({
      ...req.body,
      images: req.files?.images?.map((file, index) => ({
        imageUrl: file.path,
        url: req.body.urls[index],
      })),
    })
    await client.flushAll()
    return res.json({
      success: Boolean(newPage),
      message: Boolean(newPage) ? 'Tạo trang thành công.' : 'Tạo trang thất bại.',
    })
  },
  update: async (req, res) => {
    const editPage = await db.PageContents.findByPk(req.params.id)
    if (!editPage) throw new Error('Trang không tồn tại.')

    const [updatedPage] = await db.PageContents.update(
      {
        ...req.body,
        images: req.files?.images?.map((file, index) => ({
          imageUrl: file.path,
          url: req.body.urls[index],
        })),
      },
      { where: { id: req.params.id } },
    )
    await client.flushAll()
    return res.json({
      success: updatedPage > 0,
      message: updatedPage > 0 ? 'Sửa trang thành công.' : 'Sửa trang thất bại.',
    })
  },
  delete: async (req, res) => {
    const deletePage = await db.PageContents.findByPk(req.params.id)
    if (!deletePage) throw new Error('Trang không tồn tại.')

    const deletedPage = await db.PageContents.destroy({ where: { id: req.params.id } })
    await client.flushAll()
    return res.json({
      success: deletedPage > 0,
      message: deletedPage > 0 ? 'Xóa trang thành công.' : 'Xóa trang thất bại.',
    })
  },
  getOne: async (req, res) => {
    const page = await db.PageContents.findByPk(req.params.id)
    return res.json({
      success: !!page,
      data: page || null,
      message: page ? 'Lấy trang thành công.' : 'Trang không tồn tại.',
    })
  },
  getAll: async (req, res) => {
    const { page = 1, limit = 10, textPosition, orderIndex, orderBy } = req.query
    const queries = {}
    const cacheKey = `page:${JSON.stringify({
      page,
      limit,
      textPosition,
      orderIndex,
      orderBy,
    })}`
    if (orderIndex) {
      queries.orderIndex = {
        [Op.like]: `${orderIndex}`,
      }
    }
    if (textPosition) {
      queries.textPosition = {
        [Op.like]: `${textPosition}`,
      }
    }
    let order = [['createdAt', 'DESC']]

    if (orderBy) {
      const [field, direction] = orderBy.split(',')
      if (field) {
        order = [[field, (direction || 'DESC').toUpperCase()]]
      }
    }
    const cached = await client.get(cacheKey)

    if (cached) {
      const { data, total } = JSON.parse(cached)
      return res.json({
        success: true,
        message: 'got',
        data,
        total,
      })
    }
    const { count, rows: data } = await db.PageContents.findAndCountAll({
      where: queries,
      offset: (+page - 1) * +limit,
      limit: +limit,
      order,
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: data, total: count }))

    return res.json({
      success: Boolean(data),
      message: data ? 'Lấy danh sách trang thành công' : 'Lấy danh sách trang thất bại',
      data: data,
      total: count,
    })
  },
}
