import jwt from 'jsonwebtoken';

export const signToken = (payload: Object, signature: string, expiresIn: string | number) => {
    return jwt.sign(payload, signature, { expiresIn: expiresIn });
};

export const verifyToken = (token: string, signature: string) => {
    return jwt.verify(token, signature);
};
