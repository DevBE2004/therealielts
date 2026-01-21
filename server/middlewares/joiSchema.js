const Joi = require('joi')

const string = Joi.string().allow(null, '')
const stringReq = Joi.string().required()
const number = Joi.number().allow(null, '')
const numberReq = Joi.number().required()
const array = Joi.array().allow(null, '')
const arrayReq = Joi.array().required()
const email = Joi.string().email().required()
const boolean = Joi.boolean()
const phone = Joi.string()
  .pattern(/^\d{10,}$/)
  .required()
const date = Joi.date()
const dateReq = Joi.date().required()

const object = Joi.object()
const objectReq = Joi.object().required()

const file = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().max(5 * 1024 * 1024),
  filename: Joi.string().required(),
}).required()

const fileNotRequire = Joi.object({
  fieldname: Joi.string().optional(),
  originalname: Joi.string().optional(),
  encoding: Joi.string().optional(),
  mimetype: Joi.string().optional(),
  path: Joi.string().optional(),
  size: Joi.number()
    .max(5 * 1024 * 1024)
    .optional(),
  filename: Joi.string().optional(),
})
const filesNotRequire = Joi.alternatives().try(Joi.array().items(fileNotRequire), fileNotRequire)

const files = Joi.alternatives().try(Joi.array().items(file).required().min(1), file.required())

const goalArray = Joi.array()
  .items(
    Joi.object({
      title: stringReq,
      description: stringReq,
    }),
  )
  .required()
const levelSchema = Joi.array()
  .items(Joi.number().min(0).max(9).required())
  .length(2)
  .required()
  .messages({
    'array.base': 'Level phải là một mảng',
    'array.length': 'Level phải có exactly 2 phần tử',
    'number.base': 'Mỗi phần tử trong level phải là số',
    'number.min': 'Mỗi phần tử trong level phải từ 0-9',
    'number.max': 'Mỗi phần tử trong level phải từ 0-9',
    'any.required': 'Level là bắt buộc',
  })
module.exports = {
  string,
  stringReq,
  number,
  numberReq,
  array,
  arrayReq,
  email,
  phone,
  boolean,
  date,
  dateReq,
  file,
  files,
  goalArray,
  levelSchema,
  objectReq,
  object,
  fileNotRequire,
  filesNotRequire,
}
