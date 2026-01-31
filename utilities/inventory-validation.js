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
            .matches('^\\S+$')
            .withMessage('Please provide a classification name.')
    ];
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // inv_make must be string
        body('inv_make')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide an inventory make.'),
        // inv_model must be string
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide an inventory model.'),
        // inv_year must be a number that is 4 digits long
        body('inv_year')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4 })
            .isNumeric()
            .withMessage('Please provide an inventory year.'),
        // inv_description must be string.
        body('inv_description')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide an inventory description.'),
        // inv_price must be a number with a max length of 9
        body('inv_price')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1, max: 9 })
            .isNumeric({ no_symbols: true })
            .withMessage('Please provde an inventory price'),
        // inv_miles must be a number
        body('inv_miles')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric({ no_symbols: true })
            .withMessage('Please provide inventory miles.'),
        // inv_color must be a string
        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide an inventory color.'),
        // classificaiton_id must have a value
        body('classification_id')
            .notEmpty()
            .withMessage('Please select a classificaiton type.')
    ];
}

// vaildation for Add Classification
validate.checkAddClassificationData = async (req, res, next) => {
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

validate.checkAddInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classification_list = await utilities.buildClassificationList(classification_id);
        res.render('./inventory/add-inventory', {
            errors,
            title: 'Add Inventory',
            nav,
            classification_list,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
}

module.exports = validate;