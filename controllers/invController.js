const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors:null
    });
}

/* ***************************
 *  Build one vehicle details page
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    // gets the information from the URL. Check the inventoryRoute.js file to see where that information would be located
    const inv_id = req.params.invId; 
    const data = await invModel.getVehicleDetailsById(inv_id);
    const details = await utilities.buildVehicleDetails(data);
    let nav = await utilities.getNav();
    const title = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/details", {
        title,
        nav,
        details,
        errors:null
    });
}

/* ***************************
 *  Building the management page
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const title = 'Management Portal';
    res.render('./inventory/management', {
        title,
        nav,
        errors: null
    });
}

/* ***************************
 *  Building the add classificatoin page
 * ************************** */
invCont.buildAddClasificationView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const title = 'Add Classification'
    res.render('./inventory/add-classification', {
        title,
        nav,
        errors: null
    });
}

/* ***************************
 *  Processing New Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav();
    const classificaiton_name = req.body;

    const regResult = await invModel.addClassification(classificaiton_name);

    if (regResult) {
        req.flash('notice', `Congradulations, you have entered the new ${classificaiton_name} view`);
    } else {
        req.flash('notice', 'Sorry, the addition of the new classification has failed');
        res.status(501).render('./inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors: null,
        }); 
    }
}

invCont.buildAddInventoryView = async function (req, res, next) {
    
}

module.exports = invCont;