const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')
module.exports = {
  createStudyAbroad: async (req, res) => {
    const hasExisted = await db.StudyAbroad.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')

    let images = []
    req.files.images.map(file => images.push(file.path))
    const response = await db.StudyAbroad.create({
      ...req.body,
      images,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? 'tạo thành công' : 'tạo thất bại',
    })
  },
  updateStudyAbroad: async (req, res) => {
    const { id } = req.params
    const hasExisted = await db.StudyAbroad.findByPk(id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    let images = []
    req.files.images.map(file => images.push(file.path))
    const response = await db.StudyAbroad.update(
      {
        ...req.body,
        images,
      },
      {
        where: { id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? 'cập nhật thành công' : 'cập nhật thất bại',
    })
  },
  deleteStudyAbroad: async (req, res) => {
    const { id } = req.params
    const hasExisted = await db.StudyAbroad.findByPk(id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const response = await db.StudyAbroad.destroy({
      where: { id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? 'xóa thành công' : 'xóa thất bại',
    })
  },
  getStudyAbroad: async (req, res) => {
    const response = await db.StudyAbroad.findOne({ where: { slug: req.params.slug } })
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? 'Lấy thông tin thành công' : 'Lấy thông tin thất bại',
      data: response || null,
    })
  },
  getAllStudyAbroad: async (req, res) => {
    const { title, limit = 10, page = 1, search, sort = 'createdAt', isActive, type } = req.query
    const queries = {}
    if (title) {
      queries.title = {
        [Op.like]: `${title}%`,
      }
    }
    if (type) {
      queries.type = { [Op.like]: `${type}` }
    }
    if (isActive) queries.isActive = isActive === 'true' || isActive === '1' ? 1 : 0
    if (search) {
      queries[Op.or] = [{ title: { [Op.like]: `${search}%` } }]
    }
    const cacheKey = `studyAbroad:${JSON.stringify({
      title,
      limit,
      page,
      search,
      sort,
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

    const { count, rows: response } = await db.StudyAbroad.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: response, total: count }))
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? 'Lấy danh sách thành công' : 'Lấy danh sách thất bại',
      data: response || [],
      total: count,
    })
  },
}
