const Joi = require("joi");

const propertySchema = Joi.object({
  projectId: Joi.string().required(), // Ensure projectId is provided
  type: Joi.string().valid("apartment", "villa", "studio", "penthouse").required(),
  area: Joi.string().required(),
  floorNumber: Joi.number().integer().min(0).required(),
  code: Joi.string().required(),
  price: Joi.number().positive().required(),
  deposit: Joi.number().positive().required(),
  installment: Joi.number().positive().required(),
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
