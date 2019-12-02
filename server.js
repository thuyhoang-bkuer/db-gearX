"use strict";
require('dotenv').config()

//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express(); 


const {
    DB_USER, 
    DB_PASSWORD, 
    DB_URL, 
    DB_NAME, 
    PORT,
}  = process.env

// Body Parser Middleware
app.use(bodyParser.json()); 

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
const server = app.listen(process.env.PORT || 3000, () => {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
const dbConfig = {
    user:  DB_USER,
    password: DB_PASSWORD,
    server: DB_URL,
    database: DB_NAME,
    options: {
        encrypt: false,

    }
};

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

//GET API
app.get("/api/employee", function(req , res){
    const query = "SELECT * FROM Employee";
    executeQuery (res, query);
});

//POST API
app.post("/api/employee", function(req , res){
    const params = sqlEmployee.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
    const procedure = `USP_insertEmployee`;
    console.log(params)
    executeProcedure(res, procedure, params);
});

//PUT API
app.put("/api/employee/:id", function(req , res){
    const params = sqlEmployee.map(({key, type}) => ({key, type, value: type.type === sql.DateTime().type ? new Date(req.body[key]) : req.body[key]}));
    const procedure = `USP_updateEmployeeBySsn`;
    console.log(params)
    executeProcedure(res, procedure, params);
});

// DELETE API
app.delete("/api/employee/:id", function(req , res){
    const query = `DELETE FROM Employee WHERE ssn = '${req.params.id}'`;
    executeQuery (res, query);
});



/**
 * SQL DATA TYPE
 */

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

