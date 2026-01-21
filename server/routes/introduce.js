const router = require('express').Router()
const Joi = require('joi')
const ctrl = require('../controllers/introduceController')
const { object, filesNotRequire } = require('../middlewares/joiSchema')
const validateInfo = require('../middlewares/validateInfo')
const { verifyToken, isEditor } = require('../middlewares/verifyToken')
const { parseJSONFields } = require('../middlewares/parseFormData')
const { upload } = require('../config/cloudinary')
const { antiSpam } = require('../middlewares/antiSpam')

router.use(antiSpam)
router.post(
  '/create',
  verifyToken,
  isEditor,
  upload.fields([
    { name: 'images1', maxCount: 10 },
    { name: 'images2', maxCount: 10 },
    { name: 'images3', maxCount: 10 },
    { name: 'images4', maxCount: 10 },
    { name: 'images5', maxCount: 10 },
    { name: 'images6', maxCount: 10 },
  ]),
  parseJSONFields([
    'section1',
    'images1',
    'section2',
    'images2',
    'section3',
    'images3',
    'section4',
    'images4',
    'section5',
    'images5',
    'section6',
    'images6',
  ]),
  validateInfo(
    Joi.object({
      section1: object,
      images1: filesNotRequire,
      section2: object,
      images2: filesNotRequire,
      section3: object,
      images3: filesNotRequire,
      section4: object,
      images4: filesNotRequire,
      section5: object,
      images5: filesNotRequire,
      section6: object,
      images6: filesNotRequire,
    }),
  ),
  ctrl.create,
)
router.get('/:id', ctrl.getOne)
router.get('/', ctrl.getAll)
router.put(
  '/update/:id',
  verifyToken,
  isEditor,
  upload.fields([
    { name: 'images1', maxCount: 10 },
    { name: 'images2', maxCount: 10 },
    { name: 'images3', maxCount: 10 },
    { name: 'images4', maxCount: 10 },
    { name: 'images5', maxCount: 10 },
    { name: 'images6', maxCount: 10 },
  ]),
  parseJSONFields([
    'section1',
    'images1',
    'section2',
    'images2',
    'section3',
    'images3',
    'section4',
    'images4',
    'section5',
    'images5',
    'section6',
    'images6',
  ]),
  validateInfo(
    Joi.object({
      section1: object,
      images1: filesNotRequire,
      section2: object,
      images2: filesNotRequire,
      section3: object,
      images3: filesNotRequire,
      section4: object,
      images4: filesNotRequire,
      section5: object,
      images5: filesNotRequire,
      section6: object,
      images6: filesNotRequire,
    }),
  ),
  ctrl.update,
)

module.exports = router
