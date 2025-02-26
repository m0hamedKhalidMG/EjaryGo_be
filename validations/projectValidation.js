const Joi = require("joi");

const projectSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(3).max(100).required(),
  area: Joi.number().min(10).required(),
  units: Joi.number().min(1).required(),
  decisionNumber: Joi.string().required(),
  landOwnershipNumber: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  features: Joi.string().min(1).required(), // Changed to a string instead of an array
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    country: Joi.string().min(1).max(100).required(), // Added دولة
    governorate: Joi.string().min(1).max(100).required(), // Added محافظه
    district: Joi.string().min(1).max(100).required(), // Added حي
    innerAddress: Joi.string().min(1).max(200).required(), // Added عنوان داخل
  }).required(),
});


module.exports = projectSchema;
