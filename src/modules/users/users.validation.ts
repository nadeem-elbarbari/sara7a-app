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
