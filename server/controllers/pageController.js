const { client } = require('../config/redis.conf')
const { Op } = require('sequelize')
const db = require('../models')

module.exports = {
  create: async (req, res) => {
    // const existed = await db.Pages.findOne({
    //   where: {
    //     [Op.or]: [{ slug: req.body.slug }, { title: req.body.title }],
    //   },
    // });
    // if (existed) {
    //   if (existed.slug === req.body.slug) {
    //     throw new Error(
    //       "Đường dẫn (slug) đã tồn tại. Vui lòng chọn đường dẫn khác."
    //     );
    //   }
    //   if (existed.title === req.body.title) {
    //     throw new Error(
    //       "Tiêu đề (title) đã tồn tại. Vui lòng chọn tiêu đề khác."
    //     );
    //   }
    // }
    const newPage = await db.Pages.create(req.body)
    await client.flushAll()
    return res.json({
      success: Boolean(newPage),
      message: Boolean(newPage) ? 'Tạo mục thành công.' : 'Tạo mục thất bại.',
    })
  },
  update: async (req, res) => {
    const editPage = await db.Pages.findByPk(req.params.id)
    if (!editPage) throw new Error('Mục không tồn tại.')
    const orderIndexOld = editPage.orderIndex
    const orderIndexNew = req.body.orderIndex

    const transaction = await db.sequelize.transaction()

    // const existed = await db.Pages.findOne({
    //   where: {
    //     [Op.or]: [{ slug: req.body.slug }, { title: req.body.title }],
    //     id: {
    //       [Op.ne]: req.params.id,
    //     },
    //   },
    // })

    // if (existed) {
    //   if (existed.slug === req.body.slug) {
    //     throw new Error('Đường dẫn (slug) đã tồn tại. Vui lòng chọn đường dẫn khác.')
    //   }
    //   if (existed.title === req.body.title) {
    //     throw new Error('Tiêu đề (title) đã tồn tại. Vui lòng chọn tiêu đề khác.')
    //   }
    // }

    if (orderIndexNew < orderIndexOld) {
      //  Kéo lên
      await db.Pages.increment(
        { orderIndex: 1 },
        {
          where: {
            orderIndex: {
              [Op.gte]: orderIndexNew,
              [Op.lt]: orderIndexOld,
            },
          },
          transaction: transaction,
        },
      )
    } else if (orderIndexNew > orderIndexOld) {
      // Kéo xuống
      await db.Pages.increment(
        { orderIndex: -1 },
        {
          where: {
            orderIndex: {
              [Op.gt]: orderIndexOld,
              [Op.lte]: orderIndexNew,
            },
          },
          transaction: transaction,
        },
      )
    }

    const [updatedPage] = await db.Pages.update(
      { ...req.body, orderIndex: orderIndexNew },
      {
        where: { id: req.params.id },
        transaction: transaction,
      },
    )
    await transaction.commit()
    await client.flushAll()

    return res.json({
      success: updatedPage > 0,
      message: updatedPage > 0 ? 'Sửa mục thành công.' : 'Sửa mục thất bại.',
    })
  },
  delete: async (req, res) => {
    const id = req.params.id

    const deletePage = await db.Pages.findByPk(id)
    if (!deletePage) throw new Error('Mục không tồn tại.')

    const deletedOrderIndex = deletePage.orderIndex

    // Xoá item
    await db.Pages.destroy({ where: { id } })

    // Update orderIndex cho các item còn lại
    await db.Pages.increment(
      { orderIndex: -1 },
      {
        where: {
          orderIndex: {
            [Op.gt]: deletedOrderIndex, // chỉ giảm các orderIndex lớn hơn item vừa xoá
          },
        },
      },
    )

    await client.flushAll()

    return res.json({
      success: true,
      message: 'Xóa mục thành công.',
    })
  },
  getOne: async (req, res) => {
    const page = await db.Pages.findByPk(req.params.id)
    return res.json({
      success: !!page,
      data: page || null,
      message: page ? 'Lấy mục thành công.' : 'Mục không tồn tại.',
    })
  },
  getAll: async (req, res) => {
    const { page = 1, limit = 10, search, title, orderBy } = req.query
    const queries = {}
    const cacheKey = `page:${JSON.stringify({
      page,
      limit,
      search,
      orderBy,
    })}`
    if (title) {
      queries.title = {
        [Op.like]: `${title}`,
      }
    }
    if (search) {
      queries.title = {
        [Op.like]: `${search}%`,
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

    const { count, rows: data } = await db.Pages.findAndCountAll({
      where: queries,
      offset: (+page - 1) * +limit,
      limit: +limit,
      order,
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: data, total: count }))

    return res.json({
      success: Boolean(data),
      message: data ? 'Lấy danh sách mục thành công' : 'Lấy danh sách mục thất bại',
      data: data,
      total: count,
    })
  },
}
