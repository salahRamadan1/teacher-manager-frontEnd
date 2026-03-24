import Joi from "joi";

export const createGroupValidation = Joi.object({
    place: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(20).required(),
    price: Joi.number().min(0).required(),
    grade: Joi.string().valid("1st", "2nd", "3rd").required(),
    time: Joi.string()
        .required(),
    day: Joi.string()
        .valid(
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        )
        .required(),



    teacherId: Joi.string().hex().length(24),
});

export const updateGroupValidation = Joi.object({
    place: Joi.string().min(3).max(50),
    name: Joi.string().min(3).max(20),
    price: Joi.number().min(0),
    grade: Joi.string().valid("1st", "2nd", "3rd"),
    time: Joi.string()
    ,
    day: Joi.string()
        .valid(
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        )
    ,



    teacherId: Joi.string().hex().length(24),
});


export const validateAddGroup = (data) => {
    const { error } = createGroupValidation.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array عشان يسهل التعامل معها في UI
    return error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
    }));
};

export const validateUpdateGroup = (data) => {
    const { error } = updateGroupValidation.validate(data, { abortEarly: false });
    if (!error) return null;

    // تحويل الأخطاء لشكل Array عشان يسهل التعامل معها في UI
    return error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
    }));
};



