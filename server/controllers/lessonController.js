const { Op } = require('sequelize')
const db = require('../models')
const { client } = require('../config/redis.conf')

module.exports = {
  createLesson: async (req, res) => {
    const hasExisted = await db.Lesson.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')

    const lesson = await db.Lesson.create(req.body)
    await client.flushAll()
    return res.json({
      success: Boolean(lesson),
      message: Boolean(lesson) ? 'tạo bài học thành công.' : 'tạo bài học thất bại.',
    })
  },

  updateLesson: async (req, res) => {
    const hasExisted = await db.Lesson.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const [updatedRows] = await db.Lesson.update(req.body, {
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: updatedRows > 0,
      message: updatedRows > 0 ? 'cập nhật thành công.' : 'cập nhật thất bại.',
    })
  },

  deleteLesson: async (req, res) => {
    const hasExisted = await db.Lesson.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const deletedRows = await db.Lesson.destroy({
      where: { id: req.params.id },
    })

    await client.flushAll()
    return res.json({
      success: deletedRows > 0,
      message: deletedRows > 0 ? 'Xóa bài học thành công.' : 'Không tìm thấy bài học để xóa.',
    })
  },

  getLesson: async (req, res) => {
    const lesson = await db.Lesson.findByPk(req.params.id)
    return res.json({
      success: Boolean(lesson),
      data: lesson,
      message: lesson ? 'Lấy bài học thành công.' : 'Không tìm thấy bài học.',
    })
  },

  getLessons: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      title,
      order_index,
      courseId,
    } = req.query
    const queries = {}

    if (order_index) queries.order_index = order_index
    if (courseId) queries.courseId = courseId
    if (title) queries.title = { [Op.like]: `${title}%` }

    if (search) queries[Op.or] = [{ title: { [Op.like]: `${search}%` } }]
    const cacheKey = `news:${JSON.stringify({
      page,
      limit,
      title,
      courseId,
      order_index,
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

    const { count, rows: lessons } = await db.Lesson.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })

    await client.setEx(cacheKey, 30, JSON.stringify({ data: lessons, total: count }))

    return res.json({
      success: true,
      message: 'Lấy danh sách bài học thành công.',
      data: lessons,
      total: count,
    })
  },
}
