const redis = require('redis')
require('dotenv').config()

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_URL?.startsWith('rediss://'),
    rejectUnauthorized: process.env.NODE_ENV !== 'production',
    connectTimeout: 5000,
    reconnectStrategy: retries => {
      if (retries > 50) {
        console.log('Max retries reached, stopping reconnection attempts.')
        return new Error('Max retries reached')
      }
      return Math.min(retries * 100, 5000)
    },
  },
})

// Lắng nghe sự kiện lỗi
client.on('error', err => {
  console.error('Redis error:', err)
})

// Lắng nghe sự kiện kết nối bị đóng
client.on('end', () => {
  console.log('Redis connection closed')
})

// Lắng nghe sự kiện khi kết nối thành công
client.on('ready', () => {
  console.log('Connected to Redis')
})

client.on('reconnecting', () => {
  console.log('Reconnecting to Redis...')
})

const connectToRedis = async () => {
  try {
    if (!client.isOpen) {
      console.log('Attempting to connect to Redis...')
      await client.connect()
    } else {
      console.log('Redis client is already connected')
    }
  } catch (err) {
    console.error('Redis connection error:', err)
  }
}

// Gọi hàm kết nối
connectToRedis()

module.exports = { client }
