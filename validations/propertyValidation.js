const Joi = require("joi");

const propertySchema = Joi.object({
  projectId: Joi.string().required(), // Ensure projectId is provided
  type: Joi.string().valid("apartment", "villa", "studio", "penthouse").required(),
  area: Joi.number().positive().required(), // حولتها إلى رقم بدلًا من نص
  floorNumber: Joi.number().integer().min(0).required(),
  code: Joi.string().required(),
  // الأسعار مرتبة حسب السنوات
  totalPrice: Joi.object()
    .pattern(Joi.string().regex(/^\d+$/), Joi.number().positive().required())
    .required(),
  deposit: Joi.number().positive().required(),
  installment: Joi.number().positive().required(),
  outArea: Joi.number().min(0).default(0),

  kitchens: Joi.number().integer().min(0).required(),
  bathrooms: Joi.number().integer().min(1).required(),
  bedrooms: Joi.number().integer().min(1).required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  features: Joi.array().items(Joi.string()).required(),
  unitNumber: Joi.string().required(),
  roomSizes: Joi.object()
    .pattern(Joi.string(), Joi.number().positive().required())
    .required(),
});

module.exports = { propertySchema };
