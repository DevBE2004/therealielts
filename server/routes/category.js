const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/categoryController')
const { stringReq, object, file, fileNotRequire } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')
const { parseJSONFields } = require('../middlewares/parseFormData')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.single('icon'),
  parseJSONFields(['group']),
  validateInfo(
    Joi.object({
      name: stringReq,
      group: object,
      icon: fileNotRequire,
    }),
  ),
  ctrl.create,
)
router.use(antiSpam)
router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.single('icon'),
  parseJSONFields(['group']),
  validateInfo(
    Joi.object({
      name: stringReq,
      group: object,
      icon: fileNotRequire,
    }),
  ),
  ctrl.update,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.delete)
router.get('/:id', ctrl.getOne)
router.get('/', ctrl.getAll)
module.exports = router
