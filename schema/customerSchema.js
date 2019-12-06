const sql = require("mssql");

const customerSchema = [
  {key: "id", name: "identifierr", type: sql.Char()},
  {key: "name", name: "Name", type: sql.VarChar()},
  {key: "sex", name: "Sex", type: sql.VarChar()},
  {key: "address", name: "Address", type: sql.VarChar()},
  {key: "username", name: "User Name", type: sql.VarChar()},
  {key: "password", name: "Password's Hash", type: sql.VarChar()},
  {key: "points", name: "Accumulated points", type: sql.Int()},
];

module.exports = customerSchema;