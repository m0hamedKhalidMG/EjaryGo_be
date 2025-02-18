const Joi = require("joi");

const developerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 3 characters.',
      'string.max': 'Name must not exceed 100 characters.',
    }),

  email: Joi.string().email().required()
    .messages({ 'string.email': 'Invalid email format.' }),

  password: Joi.string().min(8).required()
    .messages({ 'string.min': 'Password must be at least 8 characters long.' }),

  contacts: Joi.array().items(
    Joi.string().pattern(/^\+?[0-9]{10,15}$/)
      .messages({ 'string.pattern.base': 'Contact number must be between 10 to 15 digits and can start with +.' })
  ).min(1).required()
    .messages({ 'array.min': 'At least one contact number is required.' }),

  commercialRegistrationNumber: Joi.string().trim().required()
    .messages({ 'string.empty': 'Commercial Registration Number is required.' }),

  taxCardNumber: Joi.string().trim().required()
    .messages({ 'string.empty': 'Tax Card Number is required.' }),

  attachments: Joi.array().items(
    Joi.string().uri()
      .messages({ 'string.uri': 'Attachment must be a valid URL.' })
  ).default([]),

  socialMedia: Joi.object({
    facebook: Joi.string().uri().allow('').default(''),
    twitter: Joi.string().uri().allow('').default(''),
    linkedIn: Joi.string().uri().allow('').default(''),
    instagram: Joi.string().uri().allow('').default(''),
  }).default({}),

  // Teams array, each containing manager and employee references
  teams: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().min(3).required()
        .messages({ 'string.min': 'Team name must be at least 3 characters.' }),

      role: Joi.string().valid('Freelancing', 'Marketing', 'Sales', 'Finance', 'Broker').required()
        .messages({ 'any.only': 'Role must be one of Engineering, Marketing, Sales, Finance, Other.' }),

      managerId: Joi.string().trim().required()  // Reference to the manager (employee ID)

        .messages({ 'string.empty': 'Manager ID is required.' }),

      employees: Joi.array().items(
        Joi.string().trim().required()  // References to employee IDs
      ).default([]),
    })
  ).default([]),
});

module.exports = developerSchema;
