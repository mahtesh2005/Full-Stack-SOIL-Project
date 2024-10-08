const { check, validationResult } = require('express-validator');
const db = require('../database');

///////////// VALIDATION MIDDLEWARE FOR SIGNUP /////////////

const signUpValidation = [

    // Validate name, email, and password fields
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isStrongPassword().withMessage('Password must be strong (8 characters including uppercase, lowercase, and special characters)'),

    // Check if the username already exists
    check('username').custom(async (value) => {
        const user = await db.user.findOne({ where: { username: value } });
        if (user) {
            throw new Error('Username already exists');
        }
        return true;
    }),

    // Check if the email already exists
    check('email').custom(async (value) => {
        const user = await db.user.findOne({ where: { email: value } });
        if (user) {
            throw new Error('Email already exists');
        }
        return true;
    }),

    // Check for errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Proceed to the route handler if no errors
    }
];

///////////// VALIDATION MIDDLEWARE FOR LOGIN /////////////

const loginValidation = [

    // Validate email and password fields
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').notEmpty().withMessage('Password is required'),

    // Check if the user exists with the provided email
    check('email').custom(async (value) => {
        const user = await db.user.findOne({ where: { email: value } });
        if (!user) {
            throw new Error('User does not exist');
        }
        return true;
    }),

    // Check for errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Proceed to the route handler if no errors
    }
];

module.exports = { signUpValidation, loginValidation };