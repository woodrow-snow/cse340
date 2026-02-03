const invModel = require('../models/inventory-model');
const Util = {};
const jwt = require('jsonwebtoken');
require('dotenv').config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = '<ul>';
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    });
    list += '</ul>';
    return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv_display">'
        data.forEach(vehicle => {
            grid += '<li>';
            grid += `<a href="../../inv/details/${vehicle.inv_id}" title=View ${vehicle.inv_make} ${vehicle.inv_model} details">
                     <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /> 
                     </a>`;  // there is (I think) an unnessecary / at the end of the img tag. Might cause issues later as this is a void tag
            grid += '<div class="namePrice"';
            grid += '<hr />';
            grid += '<h2>';
            grid += `<a href="../../inv/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>`;
            grid += '</h2>';
            grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
            grid += '</div>';
            grid += '</li>';
        });
        grid += '</ul>';
    } else {
        grid += '<p class="notice"> Sorry, no mathcing vehicles could be found.</p>';
    }
    return grid;
}

/* **************************************
* Build the vehicle details view HTML
* ************************************ */
Util.buildVehicleDetails = async function (data) {
    let details;
    if (data) {
        details = '<div id="vehicle_details">';
        details += '<picture>';
        details += `<source media="(min-width:500px)" srcset="${data.inv_image}">`;
        details += `<img src="${data.inv_thumbnail}" alt="Image of a ${data.inv_year} ${data.inv_model} ${data.inv_make}">`;
        details += '</picture>';
        details += `<h2>${data.inv_year} ${data.inv_model} ${data.inv_make} Details:</h2>`;
        details += `<section id="v_info">`; 
        details += `<p><strong>Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</strong></p>`;
        details += `<p><strong>Description:</strong> ${data.inv_description}</p>`;
        details += `<p><strong>Color:</strong> ${data.inv_color}</p>`;
        details += `<p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>`;
        details += '</section>';
        details += '</div>';
    } else {
        details += '<p class="notice">Sorry, we do not have a vehicle matching that Id in our inventory</p>';
    }
    return details;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
* Build the classification list for inventory addition
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    // getting data from
    let data = await invModel.getClassifications();
    
    // creating list
    let classificaiton_list =
        '<select name="classification_id" id="classificationList" required>';
    classificaiton_list += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
        classificaiton_list += '<option value="' + row.classification_id + '"';
        // checking to see if the classification id was passed in. If it was and it matches the current id, then that option is selected by default
        if (
            classification_id !== null &&
            row.classification_id == classification_id
        ) {
            classificaiton_list += " selected ";
        }
        classificaiton_list += ">" + row.classification_name + "</option>";
    });
    classificaiton_list += "</select>"
    return classificaiton_list;
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash('Please log in');
                    res.clearCookie('jwt');
                    return res.redirect('/account/login');
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        next();
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next();
    }
    else {
        req.flash('notice', 'Please log in.');
        return res.redirect('/account/login');
    }
}



module.exports = Util;