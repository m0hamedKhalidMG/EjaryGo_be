const Joi = require("joi");

const employeeSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    position: Joi.string().min(3).max(30).required(),
    salary: Joi.number().min(0).required(),
    target: Joi.number().min(0).required(),
    achievement: Joi.number().min(0).required(),
    total_commission: Joi.number().min(0).required(),
    profile_img: Joi.string().uri().optional(),
    contact: Joi.array()
    .items(
        Joi.string()
            .pattern(/^\+\d{1,3}\d{7,12}$/) // Corrected regex for E.164 format
            .message('Invalid phone number format. Use E.164 format like +123456789012')
    )
    .min(1) // At least one contact number required
    .max(3) // Max 3 phone numbers allowed
    .required(),
    developerId: Joi.string().trim().required()
    .messages({ 'string.empty': 'Developer ID is required.' }),
});

const validateEmployee = (data) => {
    return employeeSchema.validate(data, { abortEarly: false });
};

module.exports = { validateEmployee };
