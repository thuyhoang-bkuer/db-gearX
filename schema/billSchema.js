const sql = require("mssql");

const billSchema = [
  {key: "bill_id", name: "BuildID", type: sql.Char()},
  {key: "timestamp", name: "Timestamp", type: sql.Time()},
  {key: "total_price", name: "Total price", type: sql.Int()},
  {key: "orfer_id", name: "Order ID", type: sql.Char()},
  {key: "invoicer", name: "SSN of invoicer", type: sql.Char()}
];

module.exports = billSchema;