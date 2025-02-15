const Joi = require("joi");

const projectSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(3).max(100).required(),
  area: Joi.number().min(10).required(),
  units: Joi.number().min(1).required(),
  address: Joi.string().min(5).max(200).required(),
  decisionNumber: Joi.string().required(),
  licenseNumber: Joi.string().required(),
//   features: Joi.array().items(Joi.string()).min(1).required(),
//   location: Joi.object({
//     latitude: Joi.number().min(-90).max(90).required(),
//     longitude: Joi.number().min(-180).max(180).required(),
//   }).required(),
});

module.exports = projectSchema;
