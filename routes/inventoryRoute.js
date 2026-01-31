// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/index');
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classifiction view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// route to build detailed view
router.get('/details/:invId', utilities.handleErrors(invController.buildByInvId));

// route to management view
router.get('/', utilities.handleErrors(invController.buildManagementView));

// route to add classificaiton view
router.get('/add-classification', utilities.handleErrors(invController.buildAddClasificationView))

// route to add inventory view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventoryView));

// Post requests
// sending add classification data to db
router.post(
    '/add-classification',
    regValidate.classificationRules(),
    regValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// sending add inventory data to db
router.post(
    '/add-inventory',
    regValidate.inventoryRules(),
    regValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
);

module.exports = router;