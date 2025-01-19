import Joi from 'joi';
import { Types } from 'mongoose';

const customValidation = (value: Types.ObjectId, error: any) => {
    const isValid = Types.ObjectId.isValid(value);
    return isValid ? value : error.message(`invalid id: ${value}`);
};

const generalFields = {
    name: Joi.string().min(3).max(50),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
    phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    id: Joi.string().custom(customValidation).messages({
        'any.required': 'id is required',
        'string.empty': 'id is required',
        'string.base': 'id must be a type of ObjectId from MongoDB',
        'string.custom': 'id must be a type of ObjectId from MongoDB',
        'custom': 'id must be a type of ObjectId from MongoDB',
    }),
    headers: Joi.object().keys({
        authorization: Joi.string().required().messages({
            'any.required': 'authorization is required',
            'string.empty': 'authorization is required',
            'string.base': 'authorization must be a string',
        }),
        'cache-control': Joi.string(),
        'user-agent': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        'accept-language': Joi.string(),
        connection: Joi.string(),
        host: Joi.string(),
        origin: Joi.string(),
        'postman-token': Joi.string(),
    }),
};

export default generalFields;
