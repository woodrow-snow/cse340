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
router.get('/', utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// route to add classificaiton view
router.get('/add-classification', utilities.checkAccountType, utilities.handleErrors(invController.buildAddClasificationView))

// route to add inventory view
router.get('/add-inventory', utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventoryView));

// route to get classification id list
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));

// route to get to inventory edit by id
router.get('/edit/:invId', utilities.checkAccountType, utilities.handleErrors(invController.buildInventoryEditView));

// route to delete page
router.get('/delete/:inv_id', utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteView));

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

router.post(
    '/edit-inventory/',
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

router.post(
    '/delete/',
    utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;