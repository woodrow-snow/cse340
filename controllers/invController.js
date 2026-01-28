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

module.exports = invCont;