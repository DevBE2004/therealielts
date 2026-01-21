const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/routeController')
const { stringReq, string, goalArray } = require('../middlewares/joiSchema')
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
      slug: stringReq,
      description: string,
      goal: goalArray, //[ {"title":"1","description":"1"}, {"title":"2","description":"2"} ]
    }),
  ),
  ctrl.createRoute,
)

router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  validateInfo(
    Joi.object({
      title: stringReq,
      slug: stringReq,
      description: string,
      goal: goalArray,
    }),
  ),
  ctrl.updateRoute,
)
router.delete('/delete/:id', verifyToken, isAdmin, ctrl.deleteRoute)
router.get('/:slug', ctrl.getRoute)
router.get('/', ctrl.getRoutes)

module.exports = router
