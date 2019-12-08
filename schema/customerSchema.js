const sql = require("mssql");

const sqlCustomer = [
    {key: "id", name: "Identification", frozen: true, type: sql.Char()},
    {key: "name", name: "LastName", frozen: true, type: sql.VarChar()},
    {key: "sex", name: "Sex", type: sql.Char()},
    {key: "address", name: "Address", type: sql.VarChar()},
    {key: "user_type", name: "Type", type: sql.VarChar()},
    {key: "username", name: "Username", type: sql.VarChar()},
    {key: "password", name: "Password", type: sql.Char()},
    {key: "point", name: "Point", type: sql.Int()}
];

module.exports = sqlCustomer;