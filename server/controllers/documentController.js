const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')
module.exports = {
  createDocument: async (req, res) => {
    const category = JSON.parse(req.body.category)
    const hasExisted = await db.Document.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')

    const document = await db.Document.create({
      ...req.body,
      image: req.file.path,
      authorId: req.user.id,
      category,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(document),
      message: document ? 'tạo tài liệu thành công' : 'tạo tài liệu thất bại',
    })
  },
  updateDocument: async (req, res) => {
    const category = JSON.parse(req.body.category)
    const hasExisted = await db.Document.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const documentEdited = await db.Document.update(
      { ...req.body, image: req.file.path, category, authorId: req.user.id },
      {
        where: { id: req.params.id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(documentEdited),
      message: documentEdited ? 'cập nhật tài liệu thành công' : 'cập nhật tài liệu thất bại',
    })
  },
  deleteDocument: async (req, res) => {
    const hasExisted = await db.Document.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const documentDeleted = await db.Document.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(documentDeleted),
      message: documentDeleted ? 'xóa tài liệu thành công' : 'xóa tài liệu thất bại',
    })
  },
  getDocument: async (req, res) => {
    const document = await db.Document.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: db.User,
          as: 'author',
        },
      ],
    })
    return res.json({
      success: Boolean(document),
      message: document ? 'lấy tài liệu thành công' : 'lấy tài liệu thất bại',
      data: document,
    })
  },
  getDocuments: async (req, res) => {
    const { limit = 10, page = 1, search, title, sort = 'createdAt', isActive, type } = req.query
    const queries = {}
    if (search) {
      queries[Op.or] = [{ title: { [Op.like]: `${search}%` } }]
    }

    if (title) {
      queries.title = { [Op.like]: `${title}%` }
    }
    if (type) {
      queries.type = { [Op.like]: `${type}` }
    }
    if (isActive) queries.isActive = isActive === 'true' || isActive === '1' ? 1 : 0
    const cacheKey = `documents:${JSON.stringify({
      limit,
      page,
      search,
      sort,
      title,
      isActive,
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
    const { count, rows: documents } = await db.Document.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'author',
        },
      ],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: documents, total: count }))
    return res.json({
      success: Boolean(documents),
      message: documents ? 'lấy danh sách tài liệu thành công' : 'lấy danh sách tài liệu thất bại',
      data: documents,
      total: count,
    })
  },
}
