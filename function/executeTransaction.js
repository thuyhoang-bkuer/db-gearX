const sql = require("mssql");
const dbConfig = require("../dbConfig");

const executeProcedure = async (res, procedure, params) => {
    const sqlPool = new sql.ConnectionPool(dbConfig);
    const pool = await sqlPool.connect()

    const transaction = new sql.Transaction(pool);

    transaction.begin(error => {
        let rollBack = false;

        transaction.on('rollback', aborted => rollBack = true);

        const request = new sql.Request(transaction)

        params.map(param => {
            request.input(param.key, param.type, param.value)
        })
        request.execute(procedure, async (err, result) => {
            if (err) {
                console.log("Error while execute procedure :- " + err);
                if (rollBack) {
                    await transaction.rollback(err => res.send(err))
                }
                else res.send(err);
            } else {
                const recordsets = await transaction.commit();
                console.log(recordsets)
                res.send(recordsets);
            }
            sqlPool.close();
        });

    })

    
}


module.exports = executeProcedure;