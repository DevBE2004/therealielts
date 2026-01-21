const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/userController')
const { stringReq, string, email, phone, file } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isAdmin, isEditor } = require('../middlewares/verifyToken')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/sign-up',
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      password: stringReq,
      mobile: phone,
    }),
  ),
  ctrl.signUp,
)
router.post(
  '/sign-in',
  validateInfo(
    Joi.object({
      email: email,
      password: stringReq,
    }),
  ),
  ctrl.signIn,
)
router.get('/sign-out', verifyToken, ctrl.signOut)
router.get('/current', verifyToken, ctrl.getCurrent)
router.put(
  '/change-password',
  validateInfo(
    Joi.object({
      oldPassword: stringReq,
      newPassword: stringReq,
    }),
  ),
  verifyToken,
  ctrl.changePassword,
)
router.put(
  '/update-profile',
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      mobile: phone,
      avatar: file,
      occupation: string,
    }),
  ),
  verifyToken,
  ctrl.updateProfile,
)
router.post(
  '/forgot-password',
  validateInfo(
    Joi.object({
      email,
    }),
  ),
  ctrl.forgotPassword,
)
router.post(
  '/reset-password',
  validateInfo(
    Joi.object({
      email,
      code: stringReq,
      newPassword: stringReq,
    }),
  ),
  ctrl.resetPassword,
)
router.post(
  '/create-user-by-admin',
  verifyToken,
  isEditor,
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      password: stringReq,
      mobile: phone,
      role: Joi.string().valid('EDITOR', 'ADMIN', 'USER').default('USER'),
      avatar: file,
      occupation: string,
    }),
  ),
  ctrl.createUserByAdmin,
)
router.put(
  '/update-user-by-admin/:id',
  verifyToken,
  isEditor,
  upload.single('avatar'),
  validateInfo(
    Joi.object({
      name: stringReq,
      email: email,
      mobile: phone,
      role: Joi.string().valid('EDITOR', 'ADMIN', 'USER').default('USER'),
      password: stringReq,
      avatar: file,
      occupation: string,
    }),
  ),
  ctrl.updateUserByAdmin,
)
router.delete('/delete-user-by-admin/:id', verifyToken, isAdmin, ctrl.deleteUserByAdmin)
router.get('/:id', ctrl.getUser)
router.get('/', ctrl.getUsers)
module.exports = router
