const db = require("../models");
const { Op, fn, col, where } = require("sequelize");
const { client } = require("../config/redis.conf");
const path = require("path");
const fs = require("fs");
const { getAllMonthFolders, renameToWebp } = require("../utils/helper");

// const BASE_URL = `${process.env.CLIENT_URL}/wp-content/uploads`
// const dataRoot = path.resolve(__dirname, '../data')
// const allMonthFolders = getAllMonthFolders(dataRoot)
// const { slugType, slugImages } = require('../data/data')

module.exports = {
  create: async (req, res) => {
    const images = req.files?.images?.map((f) => f.path) ?? [];

    const exist = await db.Common.findOne({ where: { slug: req.body.slug } });
    if (exist) throw new Error("Trang đã tồn tại!");
    const Common = await db.Common.create({
      ...req.body,
      images: images,
    });
    await client.flushAll();
    return res.json({
      success: Boolean(Common),
      message: Boolean(Common) ? "thành công." : "thất bại.",
    });
  },
  update: async (req, res) => {
    const { id } = req.params;
    const images = req.files?.images?.map((f) => f.path) ?? [];
    const common = await db.Common.findByPk(id);
    if (!common) throw new Error("Không tồn tại.");
    const commonEdited = await common.update({ ...req.body, images });
    await client.flushAll();
    return res.json({
      success: Boolean(commonEdited),
      message: Boolean(commonEdited)
        ? "cập nhật thành công."
        : "cập nhật thất bại.",
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const hasExisted = await db.Common.findByPk(id);

    if (!hasExisted) throw new Error("Không tồn tại.");

    const response = await db.Common.destroy({ where: { id } });
    await client.flushAll();
    return res.json({
      success: Boolean(response),
      message: Boolean(response) ? "xóa thành công." : "xóa thất bại.",
    });
  },
  get: async (req, res) => {
    const common = await db.Common.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: db.User,
          as: "author",
        },
        {
          model: db.Lesson,
          as: "lessons",
        },
        {
          model: db.Route,
          as: "route",
        },
        {
          model: db.Category,
          as: "category",
        },
      ],
    });
    return res.json({
      success: Boolean(common),
      message: Boolean(common) ? "thành công." : "không có dữ liệu.",
      data: common,
    });
  },
  getAll: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy,
      title,
      slug,
      type,
      isActive,
      forWeb,
      categoryId,
    } = req.query;
    const queries = {};
    let order;
    if (type)
      queries.type = {
        [Op.like]: `${type}`,
      };
    if (title)
      queries.title = {
        [Op.like]: `${title}%`,
      };
    if (forWeb)
      queries.forWeb = {
        [Op.like]: `${forWeb}`,
      };
    if (slug)
      queries.slug = {
        [Op.like]: `${slug}`,
      };
    if (isActive) {
      queries.isActive = isActive === "true" || isActive === "1" ? 1 : 0;
    }
    if (categoryId) {
      queries.categoryId = {
        [Op.like]: `${categoryId}`,
      };
    }

    if (search) {
      // Tìm kiếm không phân biệt hoa thường cho cột title
      queries[Op.and] = [
        where(fn("LOWER", col("Common.title")), {
          [Op.like]: `${search.toLowerCase()}%`,
        }),
      ];
    }
    if (orderBy) {
      const [sortField, sortOrder] = orderBy.split(",");
      const validFields = ["createdAt", "updatedAt", "title", "slug"];
      const field = validFields.includes(sortField) ? sortField : "createdAt";
      const orderDir = sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
      order = [[field, orderDir]];
    }

    const cacheKey = `common:${JSON.stringify({
      limit,
      page,
      order,
      title,
      slug,
      type,
      isActive,
      forWeb,
      search,
      categoryId,
    })}`;

    const alreadyGetAll = await client.get(cacheKey);
    if (alreadyGetAll) {
      const { data, total } = JSON.parse(alreadyGetAll);
      return res.json({
        success: true,
        message: "got",
        data,
        total,
      });
    }
    const { count, rows: commons } = await db.Common.findAndCountAll({
      where: queries,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order,
      include: [
        {
          model: db.User,
          as: "author",
        },
        {
          model: db.Lesson,
          as: "lessons",
        },
        {
          model: db.Route,
          as: "route",
        },
        {
          model: db.Category,
          as: "category",
        },
        {
          model: db.PageContents,
          as: "pageContents",
          separate: true,
          order: [["orderIndex", "ASC"]],
        },
      ],
    });
    // await client.setEx(cacheKey, 30, JSON.stringify({ data: commons, total: count }))

    return res.json({
      success: Boolean(commons),
      message: Boolean(commons)
        ? "lấy dữ liệu thành công."
        : "lấy dữ liệu thất bại.",
      data: commons,
      total: count,
    });
  },
  upload: async (req, res) => {
    // //convert name file sang .webp
    //  renameToWebp(dataRoot)
    // return res.json({ success: true, mes: 'Đã chạy xong!' })
    //   // update db missing images
    //   await Promise.all(
    //     slugType.map(item => db.Common.update({ type: item.type }, { where: { slug: item.slug } })),
    //   )
    //   await Promise.all(
    //     slugImages.map(item =>
    //       db.Common.update(
    //         { images: item.images ? [...item.images, ...item.images] : null },
    //         { where: { slug: item.slug } },
    //       ),
    //     ),
    //   )
    //   // thêm hình ảnh vào db
    //   const total = await db.Common.findAll({ raw: true })
    //   total.map(
    //     async i =>
    //       await db.Common.update({ metaData: { metaTitle: i.title } }, { where: { id: i.id } }),
    //   )
    //   const recordsWithoutImages = total.filter(item => !item.images)
    //   if (recordsWithoutImages.length === 0) {
    //     return res.json({ success: true, mes: 'Tất cả record đã có hình ảnh.' })
    //   }
    //   const updatedRecords = []
    //   for (const record of recordsWithoutImages) {
    //     const slug = record.slug
    //     let matchedImage = null
    //     // 🔍 Quét qua tất cả thư mục năm/tháng
    //     for (const { absPath, year, month } of allMonthFolders) {
    //       if (!fs.existsSync(absPath)) continue
    //       const found = fs
    //         .readdirSync(absPath)
    //         // chỉ lấy file trùng slug và là ảnh hợp lệ, bỏ ảnh có kích thước
    //         .filter(
    //           file =>
    //             file.includes(slug) &&
    //             /\.(jpg|jpeg|png|webp|gif)$/i.test(file) &&
    //             !/-\d+x\d+\./.test(file),
    //           // file
    //           //   .toLowerCase()
    //           //   .includes(slug.toLowerCase().slice(0, Math.ceil(slug.length * 0.7))) &&
    //           // /\.(jpg|jpeg|png|webp|gif)$/i.test(file) &&
    //           // !/-\d+x\d+\./.test(file),
    //         )
    //       if (found.length > 0) {
    //         // ✅ lấy file đầu tiên
    //         let fileName = found[0]
    //         // nếu chưa có đuôi .webp → đổi đuôi thành .webp
    //         // if (!fileName.endsWith('.webp')) {
    //         //   fileName = fileName + '.webp'
    //         // }
    //         // tạo URL chuẩn
    //         const imageUrl = `${BASE_URL}/${year}/${month}/${encodeURIComponent(fileName)}`
    //         matchedImage = [imageUrl, imageUrl]
    //         break
    //       }
    //     }
    //     if (matchedImage) {
    //       await db.Common.update({ images: matchedImage }, { where: { id: record.id } })
    //       updatedRecords.push({ id: record.id, slug, image: matchedImage })
    //     }
    //   }
    //   return res.json({
    //     success: true,
    //     updated: updatedRecords.length,
    //     data: updatedRecords,
    //     dataNotImagesLength: recordsWithoutImages.length,
    //     dataNotImages: recordsWithoutImages.map(i => ({ id: i.id, slug: i.slug })),
    //   })
  },
};
