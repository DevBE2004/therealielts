const { Op } = require('sequelize')
const db = require('../models')
const { client } = require('../config/redis.conf')
module.exports = {
  createHonor: async (req, res) => {
    const [honor, created] = await db.Honor.findOrCreate({
      where: { email: req.body.email },
      defaults: { ...req.body, photo: req.file.path },
    })
    if (!created) throw new Error('Học viên đã tồn tại')
    await client.flushAll()
    return res.json({
      success: Boolean(created),
      message: Boolean(created) ? 'tạo thành công' : 'đã tồn tại',
    })
  },
  updateHonor: async (req, res) => {
    const hasExisted = await db.Honor.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const [updatedRows] = await db.Honor.update(
      { ...req.body, photo: req.file?.path },
      { where: { id: req.params.id } },
    )
    if (updatedRows === 0) throw new Error('Học viên không tồn tại')

    await client.flushAll()

    return res.json({
      success: Boolean(updatedRows),
      message: Boolean(updatedRows) ? 'Cập nhật thành công' : 'Không tìm thấy',
    })
  },
  deleteHonor: async (req, res) => {
    const hasExisted = await db.Honor.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const deletedRows = await db.Honor.destroy({
      where: { id: req.params.id },
    })
    if (deletedRows === 0) throw new Error('Học viên không tồn tại')
    await client.flushAll()
    return res.json({
      success: Boolean(deletedRows),
      message: Boolean(deletedRows) ? 'Xóa thành công' : 'Không tìm thấy',
    })
  },
  getHonor: async (req, res) => {
    const honor = await db.Honor.findByPk(req.params.id)
    if (!honor) throw new Error('Học viên không tồn tại')
    return res.json({
      success: true,
      data: honor,
    })
  },
  getHonors: async (req, res) => {
    const { page = 1, limit = 10, search, email, mobile, name, sort = 'createdAt' } = req.query
    const queries = {}
    if (email) queries.email = { [Op.like]: `${email}%` }
    if (mobile) queries.mobile = { [Op.like]: `${mobile}%` }
    if (name) queries.name = { [Op.like]: `${name}%` }
    if (search) {
      queries[Op.or] = [
        { email: { [Op.like]: `${search}%` } },
        { mobile: { [Op.like]: `${search}%` } },
        { name: { [Op.like]: `${search}%` } },
      ]
    }
    const cacheKey = `honors:${JSON.stringify({
      page,
      limit,
      search,
      email,
      mobile,
      name,
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
    const { count, rows: honors } = await db.Honor.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: honors, total: count }))
    return res.json({
      success: true,
      data: honors,
      total: count,
    })
  },
}
