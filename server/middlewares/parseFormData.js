module.exports = {
  parseJSONFields:
    (fields = []) =>
    (req, res, next) => {
      try {
        fields.forEach(field => {
          if (req.body[field] && typeof req.body[field] === 'string') {
            const value = req.body[field].trim()

            // Xử lý boolean strings
            if (value === 'true' || value === 'false') {
              req.body[field] = value === 'true'
            }
            // Xử lý JSON strings
            else if (
              (value.startsWith('{') && value.endsWith('}')) ||
              (value.startsWith('[') && value.endsWith(']'))
            ) {
              req.body[field] = JSON.parse(value)
            }
            // Xử lý number strings (nếu cần)
            else if (!isNaN(value) && value !== '' && !isNaN(parseFloat(value))) {
              if (['mobile'].includes(field)) {
                req.body[field] = value
              } else {
                req.body[field] = Number(value)
              }
            }
          }
        })
        next()
      } catch (error) {
        res.status(400).json({
          error: `Invalid JSON format in field: ${error.message}`,
        })
      }
    },
}
