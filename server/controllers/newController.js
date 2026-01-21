const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')
module.exports = {
  createNew: async (req, res) => {
    const hasExisted = await db.New.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')

    let images = []
    req.files.images.map(file => images.push(file.path))

    const newEntry = await db.New.create({
      ...req.body,
      images,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(newEntry),
      message: Boolean(newEntry) ? 'Tạo mới thành công' : 'Tạo mới thất bại',
    })
  },

  updateNew: async (req, res) => {
    const hasExisted = await db.New.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    let images = []
    req.files.images.map(file => images.push(file.path))
    const updatedEntry = await db.New.update(
      { ...req.body, images },
      {
        where: { id: req.params.id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(updatedEntry),
      message: Boolean(updatedEntry) ? 'Cập nhật thành công' : 'Cập nhật thất bại',
    })
  },

  deleteNew: async (req, res) => {
    const hasExisted = await db.New.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const deletedEntry = await db.New.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(deletedEntry),
      message: Boolean(deletedEntry) ? 'Xóa thành công' : 'Xóa thất bại',
    })
  },

  getNew: async (req, res) => {
    const entry = await db.New.findOne({ where: { slug: req.params.slug } })
    return res.json({
      success: Boolean(entry),
      message: Boolean(entry) ? 'Lấy thông tin thành công' : 'Không tìm thấy',
      data: entry,
    })
  },

  getNews: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      title,
      catrgory,
      search,
      sort = 'createdAt',
      isActive,
      forWeb,
      type,
    } = req.query
    const queries = {}
    if (title) {
      queries.title = { [Op.like]: `${title}%` }
    }
    if (catrgory) {
      queries.catrgory = { [Op.like]: `${catrgory}%` }
    }
    if (type) {
      queries.type = { [Op.like]: `${type}` }
    }
    if (isActive) queries.isActive = isActive === 'true' || isActive === '1' ? 1 : 0
    if (forWeb) queries.forWeb = { [Op.like]: forWeb }
    if (search) {
      queries[Op.or] = [
        { title: { [Op.like]: `${search}%` } },
        { catrgory: { [Op.like]: `${search}%` } },
      ]
    }

    const cacheKey = `news:${JSON.stringify({
      page,
      limit,
      title,
      catrgory,
      search,
      sort,
      isActive,
      forWeb,
      type,
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

    const { count, rows: entries } = await db.New.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: entries, total: count }))
    return res.json({
      success: Boolean(entries),
      message: Boolean(entries) ? 'Lấy danh sách thành công' : 'Không tìm thấy',
      data: entries,
      total: count,
    })
  },
}
