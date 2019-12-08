const express = require("express");
const sqlOrder = require("../schema/orderSchema");
const executeProcedure = require("../function/executeProcedure");
const executeQuery = require("../function/executeQuery");
const executeTransaction = require('../function/executeTransaction');
const router = express.Router();
const sql = require('mssql');

//GET API
// api/employee
router.get("/", function(req , res){
  const query = "SELECT * FROM Orders";
  executeQuery (res, query);
});

router.get("/:id/items", function(req, res){
    const procedure = "USP_getAllItemsOfOrder";
    const params = [{...sqlOrder.filter(field => field.key === "order_id")[0], value: req.params.id}];
    console.log(params)
    executeProcedure(res, procedure, params);
})

router.post("/where", function(req, res) {
    const query = `SELECT * FROM Orders WHERE ${req.body.query}`
    executeQuery(res, query);
});

router.get("/summary/:id", function(req, res) {
    const procedure = "USP_getSummaryOfOrder";
    const params = [{...sqlOrder.filter(field => field.key === "order_id")[0], value: req.params.id}];
    console.log(params)
    executeProcedure(res, procedure, params);
});

//POST API
router.post("/", function(req , res) {
    const ignores = ['order_id', 'discount'];
    const params = sqlOrder.filter(({ key }) => !ignores.includes(key))
                           .map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}))
    const procedure = `USP_insertOrders`;
    console.log(params)
    executeProcedure(res, procedure, params);
});

//PUT API
router.put("/:id", function(req , res){
  const params = sqlOrder.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_updateOrders`;
  console.log(params)
  executeProcedure(res, procedure, params);
});

// DELETE API
router.delete("/:id", function(req , res){
  const query = `DELETE FROM Orders WHERE order_id = '${req.params.id}'`;
  executeQuery (res, query);
});

module.exports = router;