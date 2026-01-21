const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/newController')
const { stringReq, string, files, boolean, object } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.fields([{ name: 'images', maxCount: 5 }]),
  validateInfo(
    Joi.object({
      title: stringReq,
      slug: stringReq,
      description: string,
      images: files,
      isActive: boolean.default(true),
      url: string,
      category: stringReq,
      forWeb: string,
      metaData: object,
    }),
  ),
  ctrl.createNew,
)
router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.fields([{ name: 'images', maxCount: 5 }]),
  validateInfo(
    Joi.object({
      title: stringReq,
      slug: stringReq,
      description: string,
      images: files,
      isActive: boolean.default(true),
      url: string,
      category: stringReq,
      forWeb: string,
      metaData: object,
    }),
  ),
  ctrl.updateNew,
)

router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteNew)
router.get('/:slug', ctrl.getNew)
router.get('/', ctrl.getNews)

module.exports = router
