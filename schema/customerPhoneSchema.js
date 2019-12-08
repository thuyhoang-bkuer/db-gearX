const sql = require("mssql");

const customerPhoneSchema = [
  {key: "id", name: "customer identifier", type: sql.Char()},
  {key: "phone_number", name: "Phone Number", type: sql.Int()}
];

module.exports = customerPhoneSchema;