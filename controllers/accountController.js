const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');


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

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
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