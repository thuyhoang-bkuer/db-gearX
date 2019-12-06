const sql = require("mssql");

const employeeEmailSchema = [
  {key: "id", name: "employee identifier", type: sql.Char()},
  {key: "email_address", name: "Email Number", type: sql.VarChar()}
];

module.exports = employeeEmailSchema;