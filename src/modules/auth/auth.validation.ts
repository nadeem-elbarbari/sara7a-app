import Joi from 'joi';
import generalFields from '../../utils/validations/generalFields';

export const signUpSchema = {
  body: Joi.object().keys({
    name: generalFields.name.required().messages({
      'string.min': 'name must be more than 3 characters and less than 50',
      'string.max': 'name must be more than 3 characters and less than 50',
      'any.required': 'name is required',
    }),
    email: generalFields.email.required().messages({
      'string.email': 'this email is not valid',
      'any.required': 'email is required',
      'string.pattern.base': 'email must be like: email@example.com',
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
    phone: generalFields.phone.required().messages({
      'any.required': 'phone is required',
      'string.pattern.base':
        'phone must be a valid egyptian phone number, has 11 digits and starts with 010 or 011 or 012 or 015',
    }),
    gender: Joi.string().valid('male', 'female').required().messages({
      'any.required': 'gender is required',
      'string.valid': 'gender must be male or female',
      'any.only': 'gender must be male or female',
    }),
    role: Joi.string().valid('user', 'admin').default('user').messages({
      'string.valid': 'role must be user or admin',
      'any.default': 'role is user by default',
      'any.only': 'role must be user or admin',
    }),
  }),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: generalFields.email.required().messages({
      'string.email': 'this email is not valid',
      'any.required': 'email is required',
      'string.pattern.base': 'email must be like: email@example.com',
    }),

    password: generalFields.password.required().messages({
      'any.required': 'password is required',
      'string.pattern.base':
        'password must be alphanumeric only and at least one uppercase and more than 8 characters and less than 16',
      'string.min': 'password must be more than 8 characters and less than 16',
      'string.max': 'password must be more than 8 characters and less than 16',
    }),
  }),
};
