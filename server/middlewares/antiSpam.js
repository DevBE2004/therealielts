const { client } = require('../config/redis.conf')

module.exports = {
  antiSpam: async (req, res, next) => {
    try {
      const ip =
        req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        req.ip
      const realIp = ip.includes('::1') ? '127.0.0.1' : ip.split(',')[0].trim()

      const redisKey = `rate_limit:${realIp}`

      const current = await client.incr(redisKey)

      if (current === 1) {
        await client.expire(redisKey, process.env.RATE_LIMIT_TIME || 60)
      }

      const limit = process.env.RATE_LIMIT_COUNT || 30

      if (current > limit) {
        return res.status(429).json({
          success: false,
          message: `Bạn đã gửi quá nhiều request. Vui lòng thử lại sau ${
            process.env.RATE_LIMIT_TIME || 60
          } giây.`,
        })
      }

      next()
    } catch (error) {
      console.error('[ANTI-SPAM ERROR]', error)
      next()
    }
  },
}
