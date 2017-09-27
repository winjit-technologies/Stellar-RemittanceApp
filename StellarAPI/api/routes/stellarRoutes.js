'use strict';
module.exports = function(app) {
  var stellarcontroller = 
  require('../controllers/stellarController.js');

  // Stellar Routes
  app.route('/CreateNewAccount')
    .get(stellarcontroller.CreateNewAccount); 

  app.route('/AccountDetails')
    .post(stellarcontroller.AccountDetails)  ;

  app.route('/SendPayment')
  .post(stellarcontroller.SendPayment)  ;  

};