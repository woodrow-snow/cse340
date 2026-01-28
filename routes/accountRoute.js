// needed resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index');
const accController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

// building login view
router.get('/login', utilities.handleErrors(accController.buildLogin));

// building sign up view
router.get('/signup', utilities.handleErrors(accController.buildSignUp));

// sending login information to db and processing
router.post(
    '/signup',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
);

module.exports = router;