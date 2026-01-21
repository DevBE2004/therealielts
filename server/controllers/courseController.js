const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')
module.exports = {
  createCourse: async (req, res) => {
    const hasExisted = await db.Course.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')

    let images = []
    const level = []
    req.files.images.map(file => images.push(file.path))
    req.body.level.map(l => level.push(Number(l)))

    const course = await db.Course.create({
      ...req.body,
      images: images,
      level,
    })
    await client.flushAll()

    return res.json({
      success: Boolean(course),
      message: Boolean(course) ? 'tạo khóa học thành công' : 'tạo khóa học thất bại',
    })
  },
  updateCourse: async (req, res) => {
    const hasExisted = await db.Course.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    let images = []
    const level = []
    req.files.images.map(file => images.push(file.path))
    req.body.level.map(l => level.push(Number(l)))

    const update = await db.Course.update(
      { ...req.body, images: images, level },
      { where: { id: req.params.id } },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(update[0]),
      message: Boolean(update[0]) ? 'Cập nhật khóa học thành công' : 'Cập nhật khóa học thất bại',
    })
  },
  deleteCourse: async (req, res) => {
    const hasExisted = await db.Course.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const deletedRows = await db.Course.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: deletedRows > 0,
      message: deletedRows > 0 ? 'xóa khóa học thành công' : 'xóa khóa học thất bại',
    })
  },
  getCourse: async (req, res) => {
    const course = await db.Course.findOne({
      where: {
        slug: req.params.slug,
      },
      include: [
        {
          model: db.Route,
          as: 'route',
        },
      ],
    })
    return res.json({
      success: Boolean(course),
      message: Boolean(course) ? 'Lấy thông tin khóa học thành công' : 'Khóa học không tồn tại',
      data: course,
    })
  },
  getCourses: async (req, res) => {
    const { limit = 10, page = 1, title, sort = 'createdAt', search, type } = req.query
    const queries = {}

    if (title) queries.title = { [Op.like]: `${title}%` }
    if (type) queries.type = { [Op.like]: `${type}` }

    if (search) {
      queries[Op.or] = [{ title: { [Op.like]: `${search}%` } }]
    }
    const cacheKey = `courses:${JSON.stringify({
      limit,
      page,
      title,
      sort,
      search,
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
    const { count, rows: courses } = await db.Course.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
      include: [
        {
          model: db.Route,
          as: 'route',
        },
      ],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: courses, total: count }))
    return res.json({
      success: Boolean(courses),
      message: Boolean(courses) ? 'Lấy danh sách khóa học thành công' : 'Không có khóa học nào',
      data: courses,
      total: count,
    })
  },
}
