const Joi = require("joi");

const medicalUnitSchema = Joi.object({
  type: Joi.string().valid("medicalUnit", "administrative").required(),
  totalPrice: Joi.object()
    .pattern(Joi.string().regex(/^\d+$/), Joi.number().positive().required()) // Yearly prices
    .required(),
  deposit: Joi.number().positive().required(),
  installment: Joi.number().positive().required(),
  projectId: Joi.string().required(), // Ensures the unit belongs to a project
  code: Joi.string().min(3).max(50).required(), // Unique identifier
  features: Joi.string().min(1).required(), // Changed to a string instead of an array
  description: Joi.string().min(1).required(), // Changed to a string instead of an array
  state: Joi.string().valid("available", "reserved", "sold").required(), // Unit state
  floorNumber: Joi.number().min(1).required(), // Floor level
  unitSize: Joi.number().positive().required(), // Total size in square meters
  officeCount: Joi.number().min(1).required(), // Number of offices
  officeSizes: Joi.array().items(Joi.number().positive().required()).min(1).required(), // Different sizes for each office
  bathroomCount: Joi.number().min(1).required(), // Number of bathrooms
  createdAt: Joi.date().default(() => new Date()), 
});

// Ensure the number of office sizes matches officeCount
medicalUnitSchema.custom((value, helpers) => {
  if (value.officeSizes.length !== value.officeCount) {
    return helpers.error("any.invalid", "officeSizes length must match officeCount");
  }
  return value;
}, "Office Sizes Validation");

module.exports = { medicalUnitSchema };
