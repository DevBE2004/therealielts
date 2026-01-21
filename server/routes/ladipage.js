const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/ladipageController')
const { stringReq, string } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor } = require('../middlewares/verifyToken')
const { antiSpam } = require('../middlewares/antiSpam')
const { upload } = require('../config/cloudinary')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.none(),
  validateInfo(
    Joi.object({
      type: stringReq,
      url: string,
      content: string,
    }),
  ),
  ctrl.create,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.none(),
  validateInfo(
    Joi.object({
      type: stringReq,
      url: string,
      content: string,
    }),
  ),
  ctrl.update,
)

router.get('/:id', ctrl.getOne)

router.get('', ctrl.getAll)

module.exports = router
