const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/commentController')
const { stringReq, file } = require('../middlewares/joiSchema')
const { verifyToken } = require('../middlewares/verifyToken')
const validateInfo = require('../middlewares/validateInfo')
const { antiSpam } = require('../middlewares/antiSpam')
const { upload } = require('../config/cloudinary')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      avatar: file,
      job: stringReq,
      content: stringReq,
    }),
  ),
  ctrl.addComment,
)

router.put(
  '/update/:id',
  verifyToken,
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      avatar: file,
      job: stringReq,
      content: stringReq,
    }),
  ),
  ctrl.updateComment,
)
router.delete('/delete/:id', verifyToken, ctrl.deleteComment)
router.get('/:id', ctrl.getComment)
router.get('/', ctrl.getComments)

module.exports = router
