const { Op } = require('sequelize')
const db = require('../models')
const { client } = require('../config/redis.conf')
module.exports = {
  createBanner: async (req, res) => {
    const hasExisted = await db.Banner.findOne({
      where: { title: req.body.title },
    })

    if (hasExisted) throw new Error('tiêu đề đã tồn tại.')
    const banner = await db.Banner.create({
      ...req.body,
      image: req.file.path,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(banner),
      message: Boolean(banner) ? 'tạo banner thành công' : 'tạo banner thất bại',
    })
  },
  updateBanner: async (req, res) => {
    const hasExisted = await db.Banner.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const banner = await db.Banner.update(
      {
        ...req.body,
        image: req.file.path,
      },
      {
        where: { id: req.params.id },
      },
    )
    await client.flushAll()
    return res.json({
      success: Boolean(banner),
      message: banner ? 'cập nhật banner thành công' : 'cập nhật banner thất bại',
    })
  },
  deleteBanner: async (req, res) => {
    const hasExisted = await db.Banner.findByPk(req.params.id)

    if (!hasExisted) throw new Error('Không tồn tại.')

    const banner = await db.Banner.destroy({
      where: { id: req.params.id },
    })
    await client.flushAll()
    return res.json({
      success: Boolean(banner),
      message: banner ? 'xóa banner thành công' : 'xóa banner thất bại',
    })
  },
  getBanner: async (req, res) => {
    const { slug } = req.params
    const banner = await db.Banner.findOne({
      where: { slug },
    })

    return res.json({
      success: Boolean(banner),
      message: banner ? 'Lấy banner thành công' : 'Lấy banner thất bại',
      data: banner,
    })
  },
  getBanners: async (req, res) => {
    const { page = 1, limit = 10, search, title, isActive, sort = 'createdAt', forWeb } = req.query
    const queries = {}
    if (search) {
      queries.title = {
        [Op.like]: `${search}%`,
      }
    }
    if (title) {
      queries.title = {
        [Op.like]: `${title}%`,
      }
    }
    if (forWeb) {
      queries.forWeb = {
        [Op.like]: forWeb,
      }
    }
    if (isActive) {
      queries.isActive = isActive === 'true' || isActive === '1' ? 1 : 0
    }
    const cacheKey = `banners:${JSON.stringify({
      page,
      limit,
      search,
      title,
      sort,
      isActive,
      forWeb,
    })}`
    const cachedBanners = await client.get(cacheKey)
    if (cachedBanners) {
      const { data, total } = JSON.parse(cachedBanners)
      return res.json({
        success: true,
        message: 'got',
        data,
        total,
      })
    }
    const { count, rows: banners } = await db.Banner.findAndCountAll({
      where: queries,
      offset: (+page - 1) * +limit,
      limit: +limit,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ data: banners, total: count }))

    return res.json({
      success: Boolean(banners),
      message: banners ? 'Lấy danh sách banner thành công' : 'Lấy danh sách banner thất bại',
      data: banners,
      total: count,
    })
  },
}
