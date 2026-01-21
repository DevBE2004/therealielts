const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/teacherController')
const { stringReq, email, phone, file, numberReq, string } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      mobile: phone,
      avatar: file,
      bio: stringReq,
      education: stringReq,
      ieltsScore: numberReq,
      yearsOfExperience: numberReq,
      teachingStyle: stringReq,
      forWeb: string,
    }),
  ),
  ctrl.createTeacher,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      mobile: phone,
      avatar: file,
      bio: stringReq,
      education: stringReq,
      ieltsScore: numberReq,
      yearsOfExperience: numberReq,
      teachingStyle: stringReq,
      forWeb: string,
    }),
  ),
  ctrl.updateTeacher,
)

router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteTeacher)
router.get('/:id', ctrl.getTeacher)
router.get('/', ctrl.getTeachers)

module.exports = router
