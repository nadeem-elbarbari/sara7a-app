import Joi from "joi";

export const messageSchema = {
    body: Joi.object().keys({
        content: Joi.string().min(1).max(255).required().messages({
            'any.required': 'content is required',
            'string.base': 'content must be a string',
            'string.max': 'content must be less than 255 characters',
            'string.min': 'content must be more than 1 character',
        }),
        receiver: Joi.string().required().messages({
            'any.required': 'receiver is required',
            'string.base': 'receiver must be a string',
        }),
    }),
};