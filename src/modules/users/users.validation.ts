import Joi from 'joi';
import generalFields from '../../utils/validations/generalFields';

export const updateProfile = {
    body: Joi.object().keys({
        name: generalFields.name.messages({
            'string.min': 'name must be more than 3 characters and less than 50',
            'string.max': 'name must be more than 3 characters and less than 50',
        }),
        email: generalFields.email.messages({
            'string.email': 'this email is not valid',

            'string.pattern.base': 'email must be like: email@example.com',
        }),
        phone: generalFields.phone.messages({
            'string.pattern.base':
                'phone must be a valid egyptian phone number, has 11 digits and starts with 010 or 011 or 012 or 015',
        }),
        gender: Joi.string().valid('male', 'female').messages({
            'string.valid': 'gender must be male or female',
            'any.only': 'gender must be male or female',
        }),
    }),
    headers: generalFields.headers,
};

export interface IChangePassword {
    oldPassword: string;
    password: string;
    rePassword: string;
}

export const changePassword = {
    body: Joi.object().keys({
        oldPassword: generalFields.password.required().messages({
            'any.required': 'oldPassword is required',
            'string.pattern.base':
                'oldPassword must be alphanumeric only and at least one uppercase and more than 8 characters and less than 16',
            'string.min': 'oldPassword must be more than 8 characters and less than 16',
            'string.max': 'oldPassword must be more than 8 characters and less than 16',
        }),
        password: generalFields.password.required().messages({
            'any.required': 'password is required',
            'string.pattern.base':
                'password must be alphanumeric only and at least one uppercase and more than 8 characters and less than 16',
            'string.min': 'password must be more than 8 characters and less than 16',
            'string.max': 'password must be more than 8 characters and less than 16',
        }),
        rePassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.required': 'rePassword is required',
            'any.only': 'rePassword must be equal to password',
        }),
    }),
    headers: generalFields.headers,
};

export const deleteProfile = {
    params: Joi.object().keys({
        id: generalFields.id.required(),
    }),
};

export const requestOTP = {
    body: Joi.object().keys({
        email: generalFields.email.required().messages({
            'string.email': 'this email is not valid',
            'any.required': 'email is required',
            'string.pattern.base': 'email must be like: email@example.com',
        }),
    }),
};

export const resetPassword = {
    body: Joi.object().keys({
        email: generalFields.email.required().messages({
            'string.email': 'this email is not valid',
            'any.required': 'email is required',
            'string.pattern.base': 'email must be like: email@example.com',
        }),
        otp: Joi.string()
            .required()
            .regex(/^[0-9]{4}$/)
            .max(4)
            .min(4)
            .messages({
                'any.required': 'otp is required',
                'string.max': 'otp must be 4 characters',
                'string.min': 'otp must be 4 characters',
                'string.pattern.base': 'otp must be 4 characters',
            }),
        newPassword: generalFields.password.required().messages({
            'any.required': 'password is required',
            'string.pattern.base':
                'password must be alphanumeric only and at least one uppercase and more than 8 characters and less than 16',
            'string.min': 'password must be more than 8 characters and less than 16',
            'string.max': 'password must be more than 8 characters and less than 16',
        }),
    }),
};

export const shareProfile = {
    params: Joi.object().keys({
        id: generalFields.id.required(),
    }),
};
