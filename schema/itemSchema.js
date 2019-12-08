const sql = require("mssql");

const sqlOrder = [
    {key: "order_id", type: sql.Char(12)},
    {key: "name", type: sql.VarChar(24)},
    {key: "prod_id", type: sql.VarChar(7)},
    {key: "price", type: sql.Float()},
    {key: "quantity", type: sql.Int()},
    {key: "description", type: sql.Char(1000)}
];

module.exports = sqlOrder;