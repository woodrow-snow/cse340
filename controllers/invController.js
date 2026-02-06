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
    const classificationSelect = await utilities.buildClassificationList();
    res.render('./inventory/management', {
        title,
        nav,
        errors: null,
        classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error('No data returned'));
    }
}

/* ***************************
 *  Building the edit inventory page
 * ************************** */
invCont.buildInventoryEditView = async function (req, res, next) {
    // getting inv_id from url
    const inv_id = parseInt(req.params.invId);

    // getting nav
    let nav = await utilities.getNav();

    const vehicleData = await invModel.getVehicleDetailsById(inv_id);
    const name = `${vehicleData.inv_make} ${vehicleData.inv_model}`;

    // creating title
    const title = `Edit ${name}`;

    // creating classificationList
    let classificationSelect = await utilities.buildClassificationList(vehicleData.classification_id);

    res.render("./inventory/edit-inventory", {
        title,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: vehicleData.inv_id,
        inv_make: vehicleData.inv_make,
        inv_model: vehicleData.inv_model,
        inv_year: vehicleData.inv_year,
        inv_description: vehicleData.inv_description,
        inv_image: vehicleData.inv_image,
        inv_thumbnail: vehicleData.inv_thumbnail,
        inv_price: vehicleData.inv_price,
        inv_miles: vehicleData.inv_miles,
        inv_color: vehicleData.inv_color,
        classification_id: vehicleData.classification_id,
    });
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req,res, next) {
    let nav = await utilities.getNav();
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    const classificationSelect = await utilities.buildClassificationList();

    const updateResult = await invModel.updateInventory(
        inv_id,
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

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model;
        req.flash('notice', `The ${itemName} was successfully updated.`)
        res.redirect('/inv/');
    } else {
        classificationSelect = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash('notice', 'Sorry, the insert has failed.')
        res.status(501).render('./inventory/edit-inventory', {
            title: 'Edit ' + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        });
    }
}

/* ***************************
 *  Building the Delete inventory page
 * ************************** */
invCont.buildDeleteView = async function (req,res,next) {

    // getting inv_id from url
    const inv_id = parseInt(req.params.inv_id);

    // getting nav
    let nav = await utilities.getNav();

    const vehicleData = await invModel.getVehicleDetailsById(inv_id);
    const name = `${vehicleData.inv_make} ${vehicleData.inv_model}`;

    // creating title
    const title = `Delete ${name}`;

    res.render("./inventory/delete-confirm", {
        title,
        nav,
        errors: null,
        inv_id: vehicleData.inv_id,
        inv_make: vehicleData.inv_make,
        inv_model: vehicleData.inv_model,
        inv_year: vehicleData.inv_year,
        inv_price: vehicleData.inv_price,
    });
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req,res, next) {
    let nav = await utilities.getNav();
    const inv_id  = parseInt(req.body.inv_id);

    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
        req.flash('notice', `The inventory was successfully deleted.`)
        res.redirect('/inv/');
    } else {
        const itemName = `${inv_make} ${inv_model}`;
        req.flash('notice', 'Sorry, the delete has failed.')
        res.status(501).render('./inventory/delete-confirm', {
            title: 'Delete ' + itemName,
            nav,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        });
    }
}

module.exports = invCont;