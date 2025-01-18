import Joi from 'joi';

const generalFields = {
  name: Joi.string().min(3).max(50),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
  phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  id: Joi.string(),
};

export default generalFields;
