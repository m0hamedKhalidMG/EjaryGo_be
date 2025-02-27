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
    teamId: Joi.string().optional(),

    National_Id: Joi.any()
    .messages({
        'any.required': 'National Id attachment (image) is required.',
    }),

    National_Id_number: Joi.string()
        .pattern(/^\d{10,15}$/) // Allows only digits (10 to 15 characters)
        .required()
        .messages({
            'string.pattern.base': 'National Id Number must be 10-15 digits long.',
            'any.required': 'National Id Number is required.',
            'string.empty': 'National Id Number cannot be empty.'
        }),

    profile_img: Joi.any()
        .optional()
        .messages({
            'string.uri': 'Profile image must be a valid URL.',
        }),

    contact: Joi.array()
        .items(
            Joi.string()
                .pattern(/^\+\d{1,3}\d{7,12}$/) // E.164 format
                .message('Invalid phone number format. Use E.164 format like +123456789012')
        )
        .min(1)
        .max(3)
        .required(),

    developerId: Joi.string().trim().required()
        .messages({ 'string.empty': 'Developer ID is required.' }),
});

// ✅ Validate Employee Data
const validateEmployee = (data) => {
    return employeeSchema.validate(data, { abortEarly: false });
};

module.exports = { validateEmployee };
