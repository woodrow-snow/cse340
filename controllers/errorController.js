const errorCont = {};

errorCont.throwError = function (req, res, next) {
    throw new Error('This is an error');
}

module.exports = errorCont;