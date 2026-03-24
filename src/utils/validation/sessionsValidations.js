import Joi from "joi";

export const createSessionSchema = Joi.object({
    grade: Joi.string().valid("1st", "2nd", "3rd").required(),
    groupId: Joi.string().required(),
    sessionPrice: Joi.number().positive().required(),
    centerPrice: Joi.number().min(0).required(),
    place: Joi.string().optional().allow(""),
    description: Joi.string().min(10)
        .max(500).required(),
    presentStudents: Joi.array().items(
        Joi.object({
            studentId: Joi.string().required(),
            payment: Joi.number().min(0).required(),
            note: Joi.string().allow("").optional(),
            name: Joi.string().allow("").optional(),
        })
    ).optional().default([]),
    absentStudents: Joi.array().items(
        Joi.object({
            studentId: Joi.string().required(),
        })
    ).optional().default([])
});
export const updateSessionValidationValue = Joi.object({
    place: Joi.string().trim().min(1).optional(),
    description: Joi.string().trim().allow("").optional(),
    sessionPrice: Joi.number().min(1).optional(),
    centerPrice: Joi.number().min(1).optional(),
});

export const updateStudentAttendanceOrNoteValidation = Joi.object({
    studentId: Joi.string()
        .hex()
        .length(24)
        .required(),

    note: Joi.string()
        .allow("")
        .trim()
        .max(500)
        .optional(),

    toggleAttendance: Joi.boolean()
        .optional()
})
    // لازم يكون في حاجة واحدة على الأقل اتبعتت
    .or("note", "toggleAttendance");
export const validateCreateSession = (data) => {
    const { error } = createSessionSchema.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array لسهولة التعامل مع ال UI
    return error.details.map((err) => ({
        path: err.path.join("."), // مثلا: presentStudents.0.payment
        message: err.message,
    }));
};
export const validateUpdateValueSession = (data) => {
    const { error } = updateSessionValidationValue.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array لسهولة التعامل مع ال UI
    return error.details.map((err) => ({
        path: err.path.join("."), // مثلا: presentStudents.0.payment
        message: err.message,
    }));
};
export const validateUpdateStudentAttendanceOrNote = (data) => {
    const { error } = updateStudentAttendanceOrNoteValidation.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array لسهولة التعامل مع ال UI
    return error.details.map((err) => ({
        path: err.path.join("."), // مثلا: presentStudents.0.payment
        message: err.message,
    }));
};