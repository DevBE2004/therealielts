const bcryptJs = require('bcryptjs')
const { generateToken, generateCode } = require('../utils/helper')
const sendEmail = require('../utils/sendEmail')
const db = require('../models')
const { Op } = require('sequelize')
const { client } = require('../config/redis.conf')

module.exports = {
  signUp: async (req, res) => {
    const response = await db.User.findOrCreate({
      where: {
        [Op.or]: [{ email: req.body.email }, { mobile: req.body.mobile }],
      },
      defaults: req.body,
    })
    return res.json({
      success: response[1],
      mes: response[1] ? 'tạo tài khoản thành công' : 'user đã tồn tại.',
    })
  },
  signIn: async (req, res) => {
    const user = await db.User.findOne({
      where: { email: req.body.email },
    })
    if (!Boolean(user)) throw new Error('người dùng k tồn tại hoặc mật khẩu sai.')
    const isMatch = bcryptJs.compareSync(req.body.password, user.dataValues.password)
    if (!Boolean(isMatch)) throw new Error('người dùng k tồn tại hoặc mật khẩu sai.')

    generateToken({ id: user.id, role: user.role }, res)

    return res.json({
      success: Boolean(isMatch),
      mes: Boolean(isMatch) ? 'đăng nhập thành công' : 'xảy ra một lỗi vui lòng thử lại!',
    })
  },
  signOut: (req, res) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
      domain: process.env.DOMAIN_SERVER,
      path: '/',
    }

    res.clearCookie('jwt', cookieOptions)

    return res.status(200).json({
      success: true,
      mes: 'Đăng xuất thành công!',
    })
  },
  getUser: async (req, res) => {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'code'] },
    })
    if (!user) throw new Error('người dùng không tồn tại.')
    return res.json({
      success: Boolean(user),
      message: Boolean(user) ? 'lấy thông tin người dùng thành công' : 'người dùng không tồn tại',
      user,
    })
  },
  getCurrent: async (req, res) => {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'code'] },
    })
    if (!user) throw new Error('người dùng không tồn tại.')
    return res.json({
      success: Boolean(user),
      message: Boolean(user) ? 'lấy thông tin người dùng thành công' : 'người dùng không tồn tại',
      user,
    })
  },
  getUsers: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      role,
      name,
      email,
      mobile,
      sort = 'createdAt',
      search,
    } = req.query
    const queries = {}
    if (role) queries.role = role
    if (name) queries.name = { [Op.like]: `${name}%` }
    if (email) queries.email = { [Op.like]: `${email}%` }
    if (mobile) queries.mobile = { [Op.like]: `${mobile}%` }
    if (search) {
      queries[Op.or] = [
        { name: { [Op.like]: `${search}%` } },
        { email: { [Op.like]: `${search}%` } },
        { mobile: { [Op.like]: `${search}%` } },
      ]
    }
    const cacheKey = `users:${JSON.stringify({
      page,
      limit,
      role,
      name,
      email,
      mobile,
      sort,
      search,
    })}`
    const alreadyGetAll = await client.get(cacheKey)
    if (alreadyGetAll) {
      const { users, total } = JSON.parse(alreadyGetAll)
      return res.json({
        success: true,
        message: 'got',
        users,
        total,
      })
    }
    const { count, rows: users } = await db.User.findAndCountAll({
      attributes: { exclude: ['password', 'code'] },
      limit: +limit,
      offset: (+page - 1) * +limit,
      where: queries,
      order: sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']],
    })
    await client.setEx(cacheKey, 30, JSON.stringify({ users, total: count }))
    return res.json({
      success: Boolean(users),
      message: Boolean(users) ? 'lấy thông tin người dùng thành công' : 'người dùng không tồn tại',
      users,
      total: count,
    })
  },
  updateProfile: async (req, res) => {
    const user = await db.User.findByPk(req.user.id)
    if (!user) throw new Error('người dùng không tồn tại.')

    const editedUser = await user.update({
      ...req.body,
      avatar: req.file.path,
    })
    return res.json({
      success: Boolean(editedUser),
      message: Boolean(editedUser)
        ? 'cập nhật thông tin người dùng thành công'
        : 'cập nhật thông tin người dùng thất bại',
      user: editedUser,
    })
  },
  changePassword: async (req, res) => {
    const user = await db.User.findByPk(req.user.id)
    if (!user) throw new Error('người dùng không tồn tại.')

    const isMatch = bcryptJs.compareSync(req.body.oldPassword, user.password)
    if (!isMatch) throw new Error('mật khẩu cũ không đúng.')

    const editedUser = await user.update({
      password: req.body.newPassword,
    })
    return res.json({
      success: Boolean(editedUser),
      message: Boolean(editedUser) ? 'cập nhật mật khẩu thành công' : 'cập nhật mật khẩu thất bại',
      user: editedUser,
    })
  },
  forgotPassword: async (req, res) => {
    const user = await db.User.findOne({
      where: { email: req.body.email },
    })
    if (!user) throw new Error('người dùng không tồn tại.')

    const code = generateCode(6)
    await db.User.update({ code }, { where: { id: user.id } })
    setTimeout(async () => {
      await db.User.update({ code: null }, { where: { id: user.id } })
    }, 10 * 60 * 1000)
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã Xác Nhận</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #007bff; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Xác Nhận Tài Khoản</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px;">Chào bạn!</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là mã xác nhận của bạn:
              </p>
              <div style="display: inline-block; background-color: #007bff; color: #ffffff; font-size: 24px; font-weight: bold; padding: 15px 25px; border-radius: 5px; margin: 20px 0;">
                ${code}
              </div>
              <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
                Vui lòng nhập mã này để hoàn tất quá trình xác nhận. Mã có hiệu lực trong vòng 10 phút.
              </p>
              <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0;">
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777777;">
              <p style="margin: 0;">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
              <p style="margin: 5px 0 0;">
                Nếu bạn gặp vấn đề với mã xác nhận, vui lòng liên hệ với chúng tôi qua trang web chính chủ.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
    sendEmail(user.email, 'Lấy lại mật khẩu', html)
      .then(() => {
        return res.json({
          success: true,
          message: 'Đã gửi email lấy lại mật khẩu. Vui lòng kiểm tra email của bạn.',
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({
          success: false,
          message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        })
      })
  },
  resetPassword: async (req, res) => {
    const { email, code, newPassword } = req.body

    const user = await db.User.findOne({ where: { email } })
    if (!user) throw new Error('người dùng không tồn tại.')

    if (user.code !== code) throw new Error('Mã xác nhận không đúng.')

    await db.User.update({ password: newPassword, code: null }, { where: { id: user.id } })

    return res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công.',
    })
  },
  createUserByAdmin: async (req, res) => {
    const user = await db.User.create({
      ...req.body,
      avatar: req.file.path,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(user),
      message: Boolean(user) ? 'Tạo người dùng thành công' : 'Tạo người dùng thất bại',
      user,
    })
  },
  updateUserByAdmin: async (req, res) => {
    const user = await db.User.findByPk(req.params.id)
    if (!user) throw new Error('người dùng không tồn tại.')

    const editedUser = await user.update({
      ...req.body,
      avatar: req.file.path,
    })
    await client.flushAll()
    return res.json({
      success: Boolean(editedUser),
      message: Boolean(editedUser)
        ? 'cập nhật thông tin người dùng thành công'
        : 'cập nhật thông tin người dùng thất bại',
      user: editedUser,
    })
  },
  deleteUserByAdmin: async (req, res) => {
    const user = await db.User.findByPk(req.params.id)
    if (!user) throw new Error('người dùng không tồn tại.')

    const deletedUser = await user.destroy()
    await client.flushAll()
    return res.json({
      success: Boolean(deletedUser),
      message: Boolean(deletedUser) ? 'xóa người dùng thành công' : 'xóa người dùng thất bại',
    })
  },
}
