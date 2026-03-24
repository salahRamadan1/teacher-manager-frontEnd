import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
});

export const validateLogin = (data) => {
  const { error } = loginSchema.validate(data, { abortEarly: false });
  if (!error) return null;

  // تحويل الأخطاء لشكل Array عشان يسهل التعامل معها في UI
  return error.details.map((err) => ({
    path: err.path[0],
    message: err.message,
  }));
};
