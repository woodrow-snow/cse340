const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req,res,next) {
    let nav = await utilities.getNav();
    res.render('account/login', {
        title: "Login",
        nav,
        errors:null
    });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // hash password before storing
    let hashedPassword;
    try {
        // regular password and cost
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash('notice', 'Sorry, there was an error processing the registration.');
        req.staus(500).render('account/signup', {
            title: "Sign Up",
            nav,
            errors: null,
        });
    }


    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        req.flash(
            'notice',
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        );
        res.status(201).render('account/login', {
            title: 'Login',
            nav,
        });
    } else {
        req.flash('notice', 'Sorry, the registration failed.')
        res.status(501).render('account/signup', {
            title: 'Sign Up',
            nav,
        });
    }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildSignUp(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/signup', {
        title: "Sign Up",
        nav,
        errors:null,
    });
}

module.exports = { buildLogin, buildSignUp, registerAccount };