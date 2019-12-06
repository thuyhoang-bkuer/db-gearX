const sql = require("mssql");

const employeePhoneSchema = [
  {key: "id", name: "employee identifier", type: sql.Char()},
  {key: "phone_number", name: "Phone Number", type: sql.Int()}
];

module.exports = employeePhoneSchema;