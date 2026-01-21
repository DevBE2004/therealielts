const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/examRegistrationController')
const { stringReq, file, dateReq, string, boolean, date } = require('../middlewares/joiSchema')
const { isEditor, verifyToken, isAdmin } = require('../middlewares/verifyToken')
const validateInfo = require('../middlewares/validateInfo')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  upload.single('bill'),
  validateInfo(
    Joi.object({
      name: string,
      mobile: string,
      email: string,
      organization: string,
      module: string,
      form: string,
      examDate: date,
      mailingAddress: string,
      promotionalProduct: string,
      passport: string,
      registrationObject: string,
      bill: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5 * 1024 * 1024),
        filename: Joi.string().required(),
      }),
      isConfirmed: boolean.default(false),
    }),
  ),
  ctrl.createExamRegistration,
)
router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.single('bill'),
  validateInfo(
    Joi.object({
      name: stringReq,
      mobile: stringReq,
      email: stringReq,
      organization: stringReq,
      module: stringReq,
      form: stringReq,
      examDate: dateReq,
      mailingAddress: stringReq,
      promotionalProduct: string,
      passport: stringReq,
      registrationObject: stringReq,
      bill: file,
      isConfirmed: boolean.default(false),
    }),
  ),
  ctrl.updateExamRegistration,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteExamRegistration)
router.get('/:id', ctrl.getExamRegistration)
router.get('/', ctrl.getExamRegistrations)

module.exports = router
