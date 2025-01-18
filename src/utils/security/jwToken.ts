import jwt from 'jsonwebtoken';

export const signToken = (payload: Object, signature: string) => {
    return jwt.sign(payload, signature, { expiresIn: '1d' });
};

export const verifyToken = (token: string, signature: string) => {
    return jwt.verify(token, signature);
};
