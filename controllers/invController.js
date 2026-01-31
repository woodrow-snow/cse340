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
    const classification_name = req.body.classification_name;

    const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
        req.flash('notice', `Congradulations, you have entered the new ${classification_name} classification`);
        nav = await utilities.getNav();
        res.status(201).render('./inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors: null
        });
    } else {
        req.flash('notice', 'Sorry, the addition of the new classification has failed');
        res.status(501).render('./inventory/add-classification', {
            title: 'Add Classification',
            nav,
        }); 
    }
}

/* ***************************
 *  Building the add inventory page
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
    // getting nav
    let nav = await utilities.getNav();

    // creating title
    const title = 'Add Inventory';

    // creating classificationList
    let classification_list = await utilities.buildClassificationList();

    res.render("./inventory/add-inventory", {
        title,
        nav,
        classification_list,
        errors: null,
    });
}

/* ***************************
 *  Processing New Inventory
 * ************************** */
invCont.addInventory = async function (req,res) {
    let nav = await utilities.getNav();
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    const classification_list = await utilities.buildClassificationList();

    const addInvResults = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id 
    );

    if (addInvResults) {
        req.flash('notice', `Congradulations, your new inventory ${inv_year} ${inv_make} ${inv_model} has been added!`)
        res.status(201).render('./inventory/add-inventory', {
            title: 'Add Inventory',
            nav,
            classification_list,
            errors: null
        });
    } else {
        req.flash('notice', 'Sorry, the addition of your inventory has failed.')
        res.status(501).render('./inventory/add-inventory', {
            title: 'Add Inventory',
            nav,
            classification_list
        });
    }
}

module.exports = invCont;