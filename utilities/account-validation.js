const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};
const accountModel = require('../models/account-model');

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a first name.'), // on error, this message is sent
        
        // lastname is required and must be a string
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage('Please provide a last name.'), // on error this message is sent
        
        // valid email is required and cannont already exist in the DB
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (emailExists) {
                    throw new Error('Email exists. Please log in or use different email.');
                    
                }
            }),
        // password is required and must be strong password
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.'),
    ]    
}

/*  **********************************
  *  Update Account Data Validation Rules
  * ********************************* */
validate.updateAccountRules = () => {
        return [
        // firstname is required and must be string
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a first name.'), // on error, this message is sent
        
        // lastname is required and must be a string
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage('Please provide a last name.'), // on error this message is sent
        
        // valid email is required and cannont already exist in the DB
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async (account_email, {req}) => {
                if (req.body.originalEmail !== account_email) {
                    console.log('In if, line 88 updateAccountRules');
                    console.log('originalEmail: ' + req.body.originalEmail);                
                    const emailExists = await accountModel.checkExistingEmail(account_email);
                    if (emailExists) {
                        throw new Error('Email exists. Please log in or use different email.');

                    }
                }
            }),

        ]
}

validate.loginRules = () => {
    return [
        // valid email is required and exists in the db.
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (!emailExists) {
                    throw new Error('Email does not exist in our Records. Please sign up.');
                }
            }),
    ]
}

/*  **********************************
  *  Update Password Data Validation Rules
  * ********************************* */
validate.updatePasswordRules = () => {
    return [
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.'),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/signup", {
            errors,
            title: "Sign Up",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
}


validate.checkLoginData = async (req, res, next) => {
    const account_email = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('accounts/index', {
            errors,
            title: 'Login In',
            nav,
            account_email
        });
        return;
    }
    next();
}

validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/update', {
            errors,
            title: "Update Information",
            nav,
            account_email,
            account_firstname,
            account_lastname
        });
        return;
    }
    next();
}

validate.checkPasswordData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/update', {
            errors,
            title: 'Update Information',
            nav,
        });
        return;
    }
    next();
}

module.exports = validate;

