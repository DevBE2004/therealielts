const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/consutationController')
const { string } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isAdmin } = require('../middlewares/verifyToken')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)

router.post(
  '/create',
  validateInfo(
    Joi.object({
      name: string,
      email: string,
      mobile: string,
      yearOfBirth: string,
      goal: string,
      difficult: string,
      schedule: string,
      atPlace: string, // POPUP || FOOTER || MAIN
      url: string,
      formName: string, // formweb-footer || formweb-popup || formweb
    }),
  ),
  ctrl.createConsultation,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteConsultation)
router.get('/', ctrl.getConsultations)

module.exports = router
