const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/pageContentController')
const { filesNotRequire, string, numberReq, array } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { parseJSONFields } = require('../middlewares/parseFormData')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  // verifyToken,
  // isEditor,
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseJSONFields(['orderIndex', 'pageId', 'urls']),
  validateInfo(
    Joi.object({
      pageId: numberReq,
      orderIndex: numberReq,
      images: filesNotRequire,
      text: string,
      textPosition: string,
      urls: array,
    }),
  ),
  ctrl.create,
)
router.put(
  '/update/:id',
  // verifyToken,
  // isEditor,
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseJSONFields(['orderIndex', 'pageId', 'urls']),
  validateInfo(
    Joi.object({
      pageId: numberReq,
      orderIndex: numberReq,
      images: filesNotRequire,
      text: string,
      textPosition: string,
      urls: array,
    }),
  ),
  ctrl.update,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.delete)
router.get('/:id', ctrl.getOne)
router.get('/', ctrl.getAll)

module.exports = router
