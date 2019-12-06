const express = require('express');
const router = express.Router();
const sqlCustomer = require('../schema/customerSchema');
const executeQuery = require('../function/executeQuery');
const executeProcedure = require('../function/executeProcedure');

router.get('/', (req, res) => {
  const query = "SELECT * FROM Customer";
  executeQuery(res, query);
});

router.post('/', (req, res) => {
  const params = sqlCustomer.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
  const procedure = `USP_insertCustomer`;
  console.log(params)
  executeProcedure(res, procedure, params);
})
router.delete("/:id", function(req , res){
  const query = `DELETE FROM Customer WHERE id = '${req.params.id}'`;
  executeQuery (res, query);
});


module.exports = router;