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

// build update view
router.get('/update/:account_id', utilities.handleErrors(accController.buildUpdate))

// sending login information to db and processing
router.post(
    '/signup',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
);

// process login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
);

router.get('/', utilities.checkLogin, utilities.handleErrors(accController.buildHome))

module.exports = router;