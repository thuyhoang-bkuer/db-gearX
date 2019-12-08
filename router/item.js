const express = require("express");
const sqlItem = require("../schema/itemSchema");
const executeProcedure = require("../function/executeProcedure");
const executeQuery = require("../function/executeQuery");
const executeTransaction = require('../function/executeTransaction');
const router = express.Router();
const sql = require('mssql');

//GET API
// api/employee
router.get("/", function(req , res){
  const query = "SELECT * FROM Item";
  executeQuery (res, query);
});

router.post("/where", function(req, res) {
    const query = `SELECT * FROM Item WHERE ${req.body.query}`
    executeQuery(res, query);
});


//POST API
router.post("/", function(req , res) {
    const params = sqlItem.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}))
    const procedure = `USP_insertItem`;
    console.log(params)
    executeProcedure(res, procedure, params);
});

//PUT API
router.put("/", function(req , res){
  const params = sqlItem.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_updateItem`;
  console.log(params)
  executeProcedure(res, procedure, params);
});

// DELETE API
router.delete("/?oid=:id&name=:name", function(req , res){
  console.log(req.params)
  const query = `DELETE FROM Item WHERE order_id = '${req.params.id}' AND name = '${req.params.name.replace('-',' ')}'`;
  executeQuery (res, query);
});

module.exports = router;