const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/documentController')
const { stringReq, file, boolean, object } = require('../middlewares/joiSchema')
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
      slug: stringReq,
      description: stringReq,
      image: file,
      category: stringReq,
      isActive: boolean.default(true),
      metaData: object,
    }),
  ),
  ctrl.createDocument,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.single('image'),
  validateInfo(
    Joi.object({
      title: stringReq,
      slug: stringReq,
      description: stringReq,
      image: file,
      category: stringReq,
      isActive: boolean.default(true),
      metaData: object,
    }),
  ),
  ctrl.updateDocument,
)

router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteDocument)
router.get('/:slug', ctrl.getDocument)
router.get('/', ctrl.getDocuments)

module.exports = router
