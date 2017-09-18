'use strict';
module.exports = function(app) {
  var stellarcontroller = 
  require('../controllers/stellarController.js');

  // Stellar Routes
  app.route('/CreateNewAccount')
    .get(stellarcontroller.CreateNewAccount); 

 
};