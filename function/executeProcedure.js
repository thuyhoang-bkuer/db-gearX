const sql = require("mssql");
const dbConfig = require("../dbConfig");

const executeProcedure = async (res, procedure, params) => { 
  const sqlPool = new sql.ConnectionPool(dbConfig);
  const pool = await sqlPool.connect()
  
  const request = new sql.Request(pool)

  params.map(param => {
      request.input(param.key, param.type, param.value)
  })
  request.execute(procedure, (err, result) => {
      if (err) {
          console.log("Error while execute procedure :- " + err);
          res.send(err);
      } else {
          const { recordsets } = result
          console.log(recordsets)
          res.send(recordsets);
      }
      sqlPool.close();
  });
}

module.exports = executeProcedure;