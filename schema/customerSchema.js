const sql = require("mssql");

const sqlCustomer = [
    {key: "ID", name: "Identification", frozen: true, type: sql.Char()},
    {key: "Name", name: "FullName", frozen: true, type: sql.VarChar()},
    {key: "sex", name: "Sex", type: sql.Char()},
    {key: "address", name: "Address", type: sql.VarChar()},
    {key: "type", name: "Type", type: sql.VarChar()},
    {key: "username", name: "Username", type: sql.VarChar()},
    {key: "password", name: "Password", type: sql.VarChar()},
    {key: "point", name: "Point", type: sql.Int()}
];

module.exports = sqlCustomer;