const { Op } = require('sequelize')
const db = require('../models')
const { client } = require('../config/redis.conf')

module.exports = {
  createTeacher: async (req, res) => {
    const [teacher, created] = await db.Teacher.findOrCreate({
      where: {
        [Op.or]: [{ email: req.body.email }, { mobile: req.body.mobile }],
      },
      defaults: { ...req.body, avatar: req.file.path },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(created),
      message: Boolean(created) ? 'thêm giáo viên thành công' : 'giáo viên đã tồn tại',
    })
  },
  updateTeacher: async (req, res) => {
    const { id } = req.params
    const teacher = await db.Teacher.findByPk(id)
    if (!teacher) throw new Error('giáo viên không tồn tại.')

    const editedTeacher = await teacher.update({
      ...req.body,
      avatar: req.file.path,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(editedTeacher),
      message: Boolean(editedTeacher)
        ? 'cập nhật thông tin giáo viên thành công'
        : 'cập nhật thông tin giáo viên thất bại',
    })
  },
  deleteTeacher: async (req, res) => {
    const { id } = req.params

    const teacher = await db.Teacher.findByPk(id)
    if (!teacher) throw new Error('giáo viên không tồn tại.')

    const deleted = await teacher.destroy()
    await client.flushAll()
    return res.json({
      success: Boolean(deleted),
      message: Boolean(deleted) ? 'xóa giáo viên thành công' : 'xóa giáo viên thất bại',
    })
  },
  getTeacher: async (req, res) => {
    const { id } = req.params

    const teacher = await db.Teacher.findByPk(id)
    if (!teacher) throw new Error('giáo viên không tồn tại.')

    return res.json({
      success: true,
      teacher,
    })
  },
  getTeachers: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      name,
      email,
      mobile,
      search,
      sort = 'createdAt',
      forWeb,
    } = req.query
    const offset = (+page - 1) * +limit
    const queries = {}
    if (name) queries.name = { [Op.like]: `${name}%` }
    if (email) queries.email = { [Op.like]: `${email}%` }
    if (mobile) queries.mobile = { [Op.like]: `${mobile}%` }
    if (forWeb) queries.forWeb = { [Op.like]: forWeb }
    if (search) {
      queries[Op.or] = [
        { name: { [Op.like]: `${search}%` } },
        { email: { [Op.like]: `${search}%` } },
        { mobile: { [Op.like]: `${search}%` } },
      ]
    }
    const cacheKey = `teachers:${JSON.stringify({
      page,
      limit,
      name,
      email,
      mobile,
      search,
      sort,
      forWeb,
    })}`
    const alreadyGetAll = await client.get(cacheKey)
    if (alreadyGetAll) {
      const { teachers, total } = JSON.parse(alreadyGetAll)
      return res.json({
        success: true,
        message: 'got',
        teachers,
        total,
      })
    }
    const { count, rows: teachers } = await db.Teacher.findAndCountAll({
      offset,
      limit: +limit,
      where: queries,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })

    await client.setEx(cacheKey, 30, JSON.stringify({ teachers, total: count }))
    return res.json({
      success: true,
      teachers,
      total: count,
    })
  },
}
