const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/bannerController')
const { stringReq, file, boolean, string } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.single('image'),
  validateInfo(
    Joi.object({
      title: stringReq,
      image: file,
      isActive: boolean.default(true),
      url: string,
      category: stringReq,
      slug: stringReq,
      forWeb: string,
    }),
  ),
  ctrl.createBanner,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.single('image'),
  validateInfo(
    Joi.object({
      title: stringReq,
      image: file,
      isActive: boolean.default(true),
      url: string,
      category: stringReq,
      slug: stringReq,
      forWeb: string,
    }),
  ),
  ctrl.updateBanner,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteBanner)

router.get('/:slug', ctrl.getBanner)

router.get('', ctrl.getBanners)

module.exports = router
