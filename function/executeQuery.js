const sql = require("mssql");
const dbConfig = require("../dbConfig");

const executeQuery = async (res, query) => { 

  const sqlPool = new sql.ConnectionPool(dbConfig);
  const pool = await sqlPool.connect()
  
  const request = new sql.Request(pool)
         
  request.query(query, (err, queryResult) => {
      if (err) {
          console.log("Error while querying database :- " + err);
          res.send(err);
      } else {
          const { recordsets } = queryResult
          console.log(recordsets)
          res.send(recordsets);
      }
      sqlPool.close();
  });
}

module.exports = executeQuery;