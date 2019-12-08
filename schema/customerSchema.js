const sql = require("mssql");

const customerSchema = [
  {key: "cus_id", name: "identifier", type: sql.Char()},
  {key: "cus_name", name: "Name", type: sql.VarChar()},
  {key: "sex", name: "Sex", type: sql.VarChar()},
  {key: "cus_address", name: "Address", type: sql.VarChar()},
  {key: "username", name: "User Name", type: sql.VarChar()},
  {key: "passwordHash", name: "Password's Hash", type: sql.VarChar()},
  {key: "points", name: "Accumulated points", type: sql.Int()},
];

module.exports = customerSchema;