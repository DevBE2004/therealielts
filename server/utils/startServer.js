const { sequelize } = require('../config/dbConnected')
const { client } = require('../config/redis.conf')
require('dotenv').config()

module.exports = {
  startServer: (app, port) => {
    let server
    let isShuttingDown = false

    server = app.listen(port, () => {
      console.log(`🚀 Server is running on port: ${port}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`⏰ Started at: ${new Date().toISOString()}`)
      console.log(`🔗 Health check available at: ${process.env.SERVER_URL}`)
    })

    server.on('error', error => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`)
      } else {
        console.error('❌ Server error:', error.message)
      }
      process.exit(1)
    })

    const gracefulShutdown = async signal => {
      if (isShuttingDown) {
        console.log('⚠️ Shutdown already in progress, skipping...')
        return
      }
      isShuttingDown = true

      console.log(`\n${signal} received, shutting down gracefully`)
      console.log('Current time:', new Date().toISOString())

      try {
        // Redis
        if (client && client.isOpen) {
          console.log('Closing Redis connection...')
          await client.quit()
          console.log('✅ Redis connection closed')
        } else {
          console.log('⚠️ Redis already closed or not initialized')
        }

        // MySQL
        if (sequelize) {
          console.log('Closing MySQL connection...')
          await sequelize.close()
          console.log('✅ MySQL connection closed')
        }

        // HTTP
        console.log('Closing HTTP server...')
        server.close(() => {
          console.log('✅ HTTP server closed')
          console.log('✅ All connections closed gracefully')
          console.log('Shutdown completed at:', new Date().toISOString())
          process.exit(0)
        })

        setTimeout(() => {
          console.error('❌ Force shutdown after timeout')
          process.exit(1)
        }, 30000)
      } catch (error) {
        console.error('❌ Error during cleanup:', error.message)
        console.error('Error stack:', error.stack)
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    process.on('uncaughtException', error => {
      console.error('❌ Uncaught Exception:', error)
      gracefulShutdown('uncaughtException')
    })
    process.on('unhandledRejection', (reason, promise) => {
      console.error('⚠️ Unhandled Rejection:', reason)
      // Tùy mức độ, có thể không cần tắt server
      // gracefulShutdown('unhandledRejection')
    })

    return server
  },
}
