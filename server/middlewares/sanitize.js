const validator = require('validator')

module.exports = {
  sanitize: (req, _res, next) => {
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = validator.escape(req.query[key])
          req.query[key] = validator.trim(req.query[key])
        }
      }
    }

    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = validator.escape(req.body[key])
          req.body[key] = validator.trim(req.body[key])
        }
      }
    }

    if (req.params) {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = validator.escape(req.params[key])
          req.params[key] = validator.trim(req.params[key])
        }
      }
    }

    next()
  },
}
