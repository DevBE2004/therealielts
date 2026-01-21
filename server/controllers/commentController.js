const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')

module.exports = {
  addComment: async (req, res) => {
    // const comment = await db.Comment.create({
    //   authorId: req.user.id,
    //   content: req.body.content,
    // })

    const comment = await db.Comment.create({
      ...req.body,
      avatar: req.file.path,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(comment),
      message: Boolean(comment) ? 'thành công.' : 'thất bại.',
    })
  },
  updateComment: async (req, res) => {
    const { id } = req.params

    const comment = await db.Comment.findByPk(id)

    if (!comment) throw new Error('Không tồn tại.')

    // if (comment.authorId != req.user.id) throw new Error('bạn không có quyền chỉnh sửa.')
    const commentEdited = await comment.update({ ...req.body, avatar: req.file.path })
    await client.flushAll()
    return res.json({
      success: Boolean(commentEdited),
      message: Boolean(commentEdited) ? 'cập nhật thành công.' : 'cập nhật thất bại.',
    })
  },
  deleteComment: async (req, res) => {
    const { id } = req.params
    const hasExisted = await db.Comment.findByPk(id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const response = await db.Comment.destroy({ where: { id } })
    await client.flushAll()
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? 'xóa thành công.' : 'xóa thất bại.',
    })
  },
  getComment: async (req, res) => {
    const comment = await db.Comment.findByPk(req.params.id)
    return res.json({
      success: Boolean(comment),
      message: Boolean(comment) ? 'thành công.' : 'thất bại.',
      data: comment,
    })
  },
  getComments: async (req, res) => {
    const { page = 1, limit = 10, search, authorId, sort = 'createdAt' } = req.query
    const queries = {}
    // if (authorId) queries.authorId = authorId
    if (search)
      queries.content = {
        [Op.like]: `${search}%`,
      }

    const cacheKey = `comment:${JSON.stringify({
      limit,
      page,
      sort,
      search,
      // authorId,
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
    const { count, rows: comments } = await db.Comment.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
      // include: [
      //   {
      //     model: db.User,
      //     as: 'author',
      //   },
      // ],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: comments, total: count }))

    return res.json({
      success: Boolean(comments),
      message: Boolean(comments) ? 'lấy dữ liệu thành công.' : 'lấy dữ liệu thất bại.',
      data: comments,
      total: count,
    })
  },
}
