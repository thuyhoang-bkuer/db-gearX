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
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
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

//GET API
app.get("/api/employee", function(req , res){
    const query = "SELECT * FROM Employee";
    executeQuery (res, query);
});

//POST API
 app.post("/api/employee", function(req , res){
    const {
        ssn,
        first_name,
        last_name,
        birth_date,
        sex,
        bank_no,
        address,
        start_date,
        salary,
        job_type,
        driver_license,
        username,
        password,
        leader
    } = req.body;
    const query = `INSERT INTO Employee VALUES ('${ssn}','${first_name}','${last_name}','${birth_date}','${sex}','${bank_no}','${address}','${start_date}',${salary},'${job_type}',${driver_license},${username},${password},${leader})`;
    console.log(query)
    executeQuery (res, query);
});

//PUT API
 app.put("/api/user/:id", function(req , res){
                var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
                executeQuery (res, query);
});

// DELETE API
 app.delete("/api/user /:id", function(req , res){
                var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
                executeQuery (res, query);
});

