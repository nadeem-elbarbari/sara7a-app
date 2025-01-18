const validation = (schema: any) => {
  return (req: any, res: any, next: any) => {
    const validationErrors = [];

    for (const key in schema) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      error && validationErrors.push({ key, error: error.details });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ validationErrors });
    }

    return next();
  };
};

export default validation;
