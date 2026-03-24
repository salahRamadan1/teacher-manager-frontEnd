import Joi from "joi";

const createExamValidation = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    totalMark: Joi.number().min(1).required(),
    grade: Joi.string().valid("1st", "2nd", "3rd").required(),
    groupId: Joi.string().hex().length(24).required(),
    sessionId: Joi.string().hex().length(24).required(),
});
export const validateCreateExam = (data) => {
    const { error } = createExamValidation.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array عشان يسهل التعامل معها في UI
    return error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
    }));
};