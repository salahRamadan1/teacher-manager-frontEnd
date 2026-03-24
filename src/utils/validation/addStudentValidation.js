import Joi from "joi";

export const createStudentSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name must be at most 20 characters",
            "any.required": "Name is required",
        }),

    phone: Joi.string()
        .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
        .required()
        .messages({
            "string.empty": "Phone is required",
            "string.pattern.base": "Invalid phone number",
        }),

    parentPhone: Joi.string()
        .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
        .required()
        .messages({
            "string.empty": "Parent phone is required",
            "string.pattern.base": "Invalid parent phone number",
        }),

    payment: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Payment must be a number",
            "number.min": "Payment cannot be negative",
            "any.required": "Payment is required",
        }),

    grade: Joi.string()
        .valid("1st", "2nd", "3rd")
        .required()
        .messages({
            "any.only": "Grade must be one of 1st, 2nd, 3rd",
            "any.required": "Grade is required",
        }),
});
export const studentSchemaValidationUpdate = Joi.object({
    name: Joi.string().min(3).max(30).messages({
        "string.empty": "Student name is required",
        "string.min": "Name must be at least 3 characters",
    }),
    phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number must be 10-15 digits",
        }),
    grade: Joi.string()
        .valid("1st", "2nd", "3rd")
        
        .messages({
            "any.only": "Grade must be 1st, 2nd, or 3rd",
            "string.empty": "Grade is required",
        }),
    parentPhone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .messages({
            "string.pattern.base": "Parent phone must be 10-15 digits",
        }),
    payment: Joi.number()
        .min(0)
        
        .messages({
            "number.base": "Payment must be a number",
            "number.min": "Payment must be at least 0",
            "any.required": "Payment is required",
        }),
});
export const validateAddStudent = (data) => {
    const { error } = createStudentSchema.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array عشان يسهل التعامل معها في UI
    return error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
    }));
};
export const validateUpdateStudent = (data) => {
    const { error } = studentSchemaValidationUpdate.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array عشان يسهل التعامل معها في UI
    return error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
    }));
};

