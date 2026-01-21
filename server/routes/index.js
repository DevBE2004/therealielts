const userRoutes = require('./user')
const courseRoutes = require('./course')
const routeRoutes = require('./route')
const newRoutes = require('./new')
const documentRoutes = require('./document')
const partnerRoutes = require('./partner')
const studyAbroadRoutes = require('./studyAbroad')
const teacherRoutes = require('./teacher')
const honorRoutes = require('./honor')
const bannerRoutes = require('./banner')
const commentRoutes = require('./comment')
const lessonRoutes = require('./lesson')
const examRegistrationRoutes = require('./examRegistration')
const consultationRoutes = require('./consultation')
const { client } = require('../config/redis.conf')
const { sequelize } = require('../config/dbConnected')
const commonRoutes = require('./common')
const categoryRoutes = require('./category')
const introduceRoutes = require('./introduce')
const pageRoutes = require('./page')
const pageContentRoutes = require('./pageContent')
const ladiPageRoutes = require('./ladipage')
const { xss } = require('express-xss-sanitizer')

const initRoutes = app => {
  app.use('/api/ladi-page', ladiPageRoutes)
  // Chống XSS attacks
  app.use(xss())
  app.use('/api/user', userRoutes)
  app.use('/api/course', courseRoutes)
  app.use('/api/route', routeRoutes)
  app.use('/api/new', newRoutes)
  app.use('/api/document', documentRoutes)
  app.use('/api/partner', partnerRoutes)
  app.use('/api/study-abroad', studyAbroadRoutes)
  app.use('/api/teacher', teacherRoutes)
  app.use('/api/honor', honorRoutes)
  app.use('/api/banner', bannerRoutes)
  app.use('/api/comment', commentRoutes)
  app.use('/api/lesson', lessonRoutes)
  app.use('/api/exam-registration', examRegistrationRoutes)
  app.use('/api/consultation', consultationRoutes)
  app.use('/api/common', commonRoutes)
  app.use('/api/category', categoryRoutes)
  app.use('/api/introduce', introduceRoutes)
  app.use('/api/page', pageRoutes)
  app.use('/api/page-content', pageContentRoutes)
  app.get('/', async (req, res) => {
    let redisStatus = 'disconnected'
    let mysqlStatus = 'disconnected'

    try {
      if (client.isOpen) {
        await client.ping()
        redisStatus = 'connected'
      }
    } catch (err) {
      console.error('Redis health check error:', err)
      redisStatus = 'error'
    }

    // Check mysql connection
    try {
      await sequelize.authenticate()
      mysqlStatus = 'connected'
    } catch (err) {
      console.error('MySQL health check error:', err)
      mysqlStatus = 'error'
    }

    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: `${process.uptime().toFixed(2)} seconds`,
      server: {
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        },
        databases: {
          redis: {
            status: redisStatus,
          },
          mysql: {
            status: mysqlStatus,
          },
        },
      },
    }
    res.status(200).json(healthCheck)
  })
}

module.exports = initRoutes
