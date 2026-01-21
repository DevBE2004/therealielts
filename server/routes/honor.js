const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/honorController')
const { stringReq, email, phone, file, boolean } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.single('photo'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      mobile: phone,
      achievement: stringReq,
      awardDate: Joi.date().default(Date.now),
      description: stringReq,
      photo: file,
      isPublic: boolean.default(true),
    }),
  ),
  ctrl.createHonor,
)
router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.single('photo'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      mobile: phone,
      achievement: stringReq,
      awardDate: Joi.date().default(Date.now),
      description: stringReq,
      photo: file,
      isPublic: boolean.default(true),
    }),
  ),
  ctrl.updateHonor,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteHonor)

router.get('/:id', ctrl.getHonor)
router.get('/', ctrl.getHonors)

module.exports = router
