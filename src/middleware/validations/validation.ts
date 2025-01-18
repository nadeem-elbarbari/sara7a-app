export interface IError extends Error {
    validationErrors: object[];
}

const validation = (schema: any) => {
    return (req: any, res: any, next: any) => {
        const validationErrors = [];

        for (const key in schema) {
            const { error } = schema[key].validate(req[key], { abortEarly: false });

            error && validationErrors.push({ path: key, error: error.details });
        }

        if (validationErrors.length > 0) {
            const error = new Error('validation error', { cause: 400 }) as IError;

            error.validationErrors = validationErrors;

            return next(error);
        }

        return next();
    };
};

export default validation;
