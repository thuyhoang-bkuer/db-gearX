const sql = require("mssql");

const customerEmailSchema = [
  {key: "id", name: "customer identifier", type: sql.Char()},
  {key: "email_address", name: "Email address", type: sql.VarChar()}
];

module.exports = customerEmailSchema;