const sql = require("mssql");

const sqlOrder = [
    {key: "order_id", type: sql.Char(12)},
    {key: "status", type: sql.VarChar(12)},
    {key: "payment_type", type: sql.VarChar(10)},
    {key: "discount", type: sql.Float()},
    {key: "cid", type: sql.Char(9)},
    {key: "essn", type: sql.Char(9)}
];

module.exports = sqlOrder;