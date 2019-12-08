const sql = require("mssql");

const productSchema = [
  {key: "prod_id", name: "Product id", type: sql.Char()},
  {key: "cost", name: "Product cost", type: sql.Float()},
  {key: "producer", name: "Producer", type: sql.VarChar()},
  {key: "prod_type", name: "Product type", type: sql.VarChar()},
  {key: "remain", name: "Product remain", type: sql.Int()}
];

module.exports = productSchema;