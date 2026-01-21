const { Sequelize } = require('sequelize')

const isProduction = process.env.NODE_ENV === 'production'
const hasCaCert = process.env.DB_CA_CERT && process.env.DB_CA_CERT.trim() !== ''

// Config SSL động
const dialectOptions = {}

if (isProduction && hasCaCert) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
    ca: process.env.DB_CA_CERT,
  }
} else {
  dialectOptions.ssl = false
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  timezone: '+07:00',
  logging: false,
  dialectOptions,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
})
const dbConnected = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(error => {
      console.error('Unable to connect to the database:', error)
    })
}
module.exports = { dbConnected, sequelize }
