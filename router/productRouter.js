const express = require("express");
const productSchema = require("../schema/productSchema");
const executeProcedure = require("../function/executeProcedure");
const executeQuery = require("../function/executeQuery");
const executeTransaction = require('../function/executeTransaction');
const router = express.Router();
const sql = require('mssql');

//GET API
// api/employee
router.get("/", function(req , res){
  const query = "SELECT * FROM Product";
  executeQuery (res, query);
});

//POST API
router.post("/queries", function(req, res) {
  const query = `SELECT * FROM Product WHERE ${req.body.query}`
  executeQuery(res, query);
});

router.post("/", function(req , res){
  const params = productSchema.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_insertProduct`;
  console.log(params)
  executeProcedure(res, procedure, params);
});

//PUT API
router.put("/:id", function(req , res){
  console.log("OK")
  const params = productSchema.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_updateProduct`;
  console.log(params)
  executeProcedure(res, procedure, params);
});

//DELETE API
router.delete("/:id", function(req , res){
  const query = `DELETE FROM Product WHERE prod_id = '${req.params.id}'`;
  executeQuery (res, query);
});

module.exports = router;