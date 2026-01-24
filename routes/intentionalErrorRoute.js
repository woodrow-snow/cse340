const epxress = require('express');
const router = new epxress.Router();
const errorController = require('../controllers/errorController');
const utilities = require('../utilities/index');

router.get('/', utilities.handleErrors(errorController.throwError));

module.exports = router;