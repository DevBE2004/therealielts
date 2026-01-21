const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const generateToken = (payload, res) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' })
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    signed: true,
    domain: process.env.DOMAIN_SERVER,
    path: '/',
  })
  return token
}
const generateCode = n => {
  let result = Math.floor(1 + Math.random() * 9).toString()
  for (let i = 1; i < n; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }

  return result
}
const getAllMonthFolders = rootDir => {
  const folders = []
  if (!fs.existsSync(rootDir)) return folders

  const years = fs.readdirSync(rootDir, { withFileTypes: true }).filter(d => d.isDirectory())

  for (const yearDir of years) {
    const yearPath = path.join(rootDir, yearDir.name)
    const months = fs.readdirSync(yearPath, { withFileTypes: true }).filter(d => d.isDirectory())

    for (const monthDir of months) {
      folders.push({
        absPath: path.join(yearPath, monthDir.name),
        year: yearDir.name,
        month: monthDir.name,
      })
    }
  }

  return folders
}

const renameToWebp = dirPath => {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name)

    if (item.isDirectory()) {
      // Đệ quy tiếp vào các thư mục con (VD: năm/tháng)
      renameToWebp(fullPath)
    } else {
      // Kiểm tra đuôi file
      const ext = path.extname(item.name).toLowerCase()

      // Bỏ qua nếu đã là .webp
      if (ext === '.webp') continue

      // Nếu là ảnh jpg/jpeg/png/gif
      if (/\.(jpg|jpeg|png|gif)$/i.test(ext)) {
        const newFilePath = fullPath + '.webp'

        // ✅ Đổi tên file
        fs.renameSync(fullPath, newFilePath)

        console.log(`✅ ${item.name} → ${path.basename(newFilePath)}`)
      }
    }
  }
}

module.exports = {
  generateToken,
  generateCode,
  getAllMonthFolders,
  renameToWebp,
}
