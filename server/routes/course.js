const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/courseController')
const {
  stringReq,
  numberReq,
  files,
  levelSchema,
  array,
  object,
} = require('../middlewares/joiSchema')
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
      description: stringReq,
      duration: stringReq,
      routeId: numberReq,
      images: files,
      totalHours: numberReq,
      level: levelSchema,
      target: numberReq,
      benefit: array.items(stringReq),
      metaData: object,
    }),
  ),
  ctrl.createCourse,
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
      description: stringReq,
      duration: stringReq,
      routeId: numberReq,
      images: files,
      totalHours: numberReq,
      level: levelSchema,
      target: numberReq,
      benefit: array.items(stringReq),
      metaData: object,
    }),
  ),
  ctrl.updateCourse,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteCourse)
router.get('/:slug', ctrl.getCourse)
router.get('/', ctrl.getCourses)

module.exports = router
