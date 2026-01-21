const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/lessonController')
const { stringReq, numberReq } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor, isAdmin } = require('../middlewares/verifyToken')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  validateInfo(
    Joi.object({
      title: stringReq,
      description: stringReq,
      details: stringReq,
      order_index: numberReq,
      // courseId: numberReq,
      commonId: numberReq,
    }),
  ),
  ctrl.createLesson,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  validateInfo(
    Joi.object({
      title: stringReq,
      description: stringReq,
      details: stringReq,
      order_index: numberReq,
      // courseId: numberReq,
      commonId: numberReq,
    }),
  ),
  ctrl.updateLesson,
)

router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteLesson)

router.get('/:id', ctrl.getLesson)

router.get('/', ctrl.getLessons)

module.exports = router
