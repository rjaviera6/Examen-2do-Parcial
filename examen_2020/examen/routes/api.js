var express = require('express');
var router = express.Router();

// localhost:3000/api/employees/
function initApi(db){
  var employeeRoutes = require('./api/employee')(db);
  router.use('/employees', employeeRoutes);
  return router;
}

module.exports = initApi;
