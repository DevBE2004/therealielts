const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/commonController')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const {
  stringReq,
  string,
  files,
  number,
  objectReq,
  array,
  boolean,
} = require('../middlewares/joiSchema')
const { antiSpam } = require('../middlewares/antiSpam')
const validateInfo = require('../middlewares/validateInfo')
const { parseJSONFields } = require('../middlewares/parseFormData')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseJSONFields(['authorId', 'metaData', 'isActive', 'category', 'benefit', 'level']),
  validateInfo(
    Joi.object({
      title: stringReq,
      slug: stringReq,
      description: string,
      images: files,
      duration: string,
      routeId: number,
      type: string,
      totalHours: string,
      metaData: objectReq,
      level: array,
      target: number,
      benefit: array,
      authorId: number,
      isActive: boolean,
      categoryId: number,
      url: string,
      forWeb: string,
      urlYoutube: string,
      descriptionSidebar: string,
    }),
  ),
  ctrl.create,
)
router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseJSONFields(['authorId', 'metaData', 'isActive', 'category', 'benefit', 'level']),
  validateInfo(
    Joi.object({
      title: stringReq,
      slug: stringReq,
      description: string,
      images: files,
      duration: string,
      routeId: number,
      type: string,
      totalHours: string,
      metaData: objectReq,
      level: array,
      target: number,
      benefit: array,
      authorId: number,
      isActive: boolean,
      categoryId: number,
      url: string,
      forWeb: string,
      urlYoutube: string,
      descriptionSidebar: string,
    }),
  ),
  ctrl.update,
)
router.delete('/delete/:id', verifyToken, isEditor, isAdmin, ctrl.delete)
router.get('/upload', ctrl.upload)
router.get('/:slug', ctrl.get)
router.get('/', ctrl.getAll)

module.exports = router
