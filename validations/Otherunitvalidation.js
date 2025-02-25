const Joi = require("joi");

const OtherUnitSchema = Joi.object({
  type: Joi.string().valid("Entertainment", "Commercial").required(), // Property type
  totalPrice: Joi.object()
    .pattern(Joi.string().regex(/^\d+$/), Joi.number().positive().required()) // Yearly prices
    .required(),
  deposit: Joi.number().positive().required(),
  installment: Joi.number().positive().required(),
  projectId: Joi.string().required(), // Ensures the unit belongs to a project
  code: Joi.string().min(3).max(50).required(), // Unique identifier
  features: Joi.string().min(1).required(), // Features as a string
  description: Joi.string().min(1).required(), // Description as a string
  state: Joi.string().valid("available", "reserved", "sold").required(), // Unit state
  unitSize: Joi.number().positive().required(), // Size in square meters
  createdAt: Joi.date().default(() => new Date()), 
});

module.exports = { OtherUnitSchema }; 
