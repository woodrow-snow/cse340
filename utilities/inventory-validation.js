const { body, validationResult } = require('express-validator');
const validate = {};
const utilities = require('.');

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches('/^\S+$/')
            .withMessage('Please provide a classification name.')
    ];
}

validate.checkRegData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('./inventory/add-classification', {
            errors,
            title: "Add Classification",
            nav
        });
        return;
    }
    next();
}

module.exports = validate;