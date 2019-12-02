const express = require("express");
const sqlEmployee = require("../schema/employeeSchema");
const executeProcedure = require("../function/executeProcedure");
const executeQuery = require("../function/executeQuery");
const router = express.Router();

//GET API
// api/employee
router.get("/", function(req , res){
  const query = "SELECT * FROM Employee";
  executeQuery (res, query);
});

//POST API
router.post("/", function(req , res){
  const params = sqlEmployee.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_insertEmployee`;
  console.log(params)
  executeProcedure(res, procedure, params);
});

//PUT API
router.put("/:id", function(req , res){
  const params = sqlEmployee.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_updateEmployeeBySsn`;
  console.log(params)
  executeProcedure(res, procedure, params);
});

// DELETE API
router.delete("/:id", function(req , res){
  const query = `DELETE FROM Employee WHERE ssn = '${req.params.id}'`;
  executeQuery (res, query);
});

module.exports = router;