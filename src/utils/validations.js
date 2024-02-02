const joi = require('joi');

const userSchema = joi.object({
    email: joi.string().email().max(100).required(),
    username: joi.string().max(50).required(),
    password: joi.string().max(255).required()
});

const insertExpenseSchema = joi.object({
	category_id: joi.number().id().required(),
    amount : joi.number().required(),
    description: joi.string().max(255),
    details: joi.object({
        location: joi.string(),
        tags: joi.array()
    })
});

const updateExpenseSchema = joi.object({
	expense_id: joi.number().id().required(),
    amount_paid : joi.number().required(),
});

const validateUser = (req, res, next) => {
    const { value, error } = userSchema.validate(req.body.userData)

    if(error) {
        res.status(403);
        throw new Error(error.message);
    }

    req.validatedUserData = value;
    next();
}

const validateInsertExpense = (req, res, next) => {
    const { value, error } = insertExpenseSchema.validate(req.body.expenseData)

    if(error) {
        res.status(403);
        throw new Error(error.message);
    }

    req.validatedInsertExpenseData = value;
    next();
}

const  validateUpdateExpense = (req, res, next) => {
    const { value, error } = updateExpenseSchema.validate(req.body.updateData)

    if(error) {
        res.status(403);
        throw new Error(error.message);
    }

    req.validatedUpdateExpenseData = value;
    next();
}

module.exports = {
    validateUser,
    validateInsertExpense,
    validateUpdateExpense
};