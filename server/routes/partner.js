const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/partnerController')
const { stringReq, string, files } = require('../middlewares/joiSchema')
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
      name: stringReq,
      description: string,
      images: files,
      category: stringReq,
      forWeb: string,
    }),
  ),
  ctrl.createPartner,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.fields([{ name: 'images', maxCount: 5 }]),
  validateInfo(
    Joi.object({
      name: stringReq,
      description: string,
      images: files,
      category: stringReq,
      forWeb: string,
    }),
  ),
  ctrl.updatedPartner,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deletePartner)
router.get('/:id', ctrl.getPartner)
router.get('/', ctrl.getPartners)

module.exports = router
