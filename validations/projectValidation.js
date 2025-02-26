const Joi = require("joi");

const projectSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(3).max(100).required(),
  area: Joi.number().min(10).required(),
  units: Joi.number().min(1).required(),
  decisionNumber: Joi.string().required(),
  residentialNumber: Joi.number().min(0).required(),
  commercialNumber: Joi.number().min(0).required(),
  entertainmentNumber: Joi.number().min(0).required(),
  healthNumber: Joi.number().min(0).required(),
  industrialNumber: Joi.number().min(0).required(),
  images: Joi.array().items(
    Joi.string().uri()
      .messages({ 'string.uri': 'images must be a valid URL.' })
  ).default([]),
  landOwnershipDocs: Joi.string()
  .uri()
  .messages({
    'string.uri': 'landOwnershipDocs must be a valid URL.'
  })
  .allow('') 
  .default(''), 
  video: Joi.string()
  .uri()
  .messages({
    'string.uri': 'video must be a valid URL.'
  })
  .allow('') 
  .default(''), 
  ministerialDecision: Joi.string()
  .uri()
  .messages({
    'string.uri': 'ministerialDecision must be a valid URL.'
  })
  .allow('') 
  .default(''), 
  constructionDocs: Joi.string()
  .uri()
  .messages({
    'string.uri': 'constructionDocs must be a valid URL.'
  })
  .allow('') 
  .default(''), 
  logo: Joi.string()
  .uri()
  .messages({
    'string.uri': 'logo must be a valid URL.'
  })
  .allow('') 
  .default(''), 
  threeD: Joi.array().items(
    Joi.string().uri()
      .messages({ 'string.uri': 'threeD must be a valid URL.' })
  ).default([]),
  landOwnershipNumber: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  features: Joi.string().min(1).required(), //  to a string instead of an array
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    country: Joi.string().min(1).max(100).required(), // Added دولة
    governorate: Joi.string().min(1).max(100).required(), // Added محافظه
    district: Joi.string().min(1).max(100).required(), // Added حي
    Address: Joi.string().min(1).max(200).required(), // Added عنوان داخل
  }).required(),
});


module.exports = projectSchema;
