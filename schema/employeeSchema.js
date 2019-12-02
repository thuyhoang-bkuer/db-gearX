const sql = require("mssql");

const sqlEmployee = [
  {key: "ssn", name: "SocialSecureNumber", type: sql.Char()},
  {key: "last_name", name: "Last Name", type: sql.VarChar()},
  {key: "first_name", name: "First Name", type: sql.VarChar()},
  {key: "birth_date", name: "Birth", type: sql.DateTime()},
  {key: "sex", name: "Sex", type: sql.Char()},
  {key: "bank_no", name: "Bank Number", type: sql.Char()},
  {key: "address", name: "Address", type: sql.VarChar()},
  {key: "start_date", name: "Starting Date", type: sql.DateTime()},
  {key: "salary", name: "Salary", type: sql.Int()},
  {key: "job_type", name: "Job Type", type: sql.VarChar()},
  {key: "driver_license", name: "Driver License", type: sql.Char()},
  {key: "username", name: "Username", type: sql.VarChar()},
  {key: "password", name: "Password", type: sql.Char()},
  {key: "leader", name: "Leader's SSN", type: sql.Char()},
];

module.exports = sqlEmployee;