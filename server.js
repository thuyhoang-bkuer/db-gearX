"use strict";
require('dotenv').config()

//Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express(); 
const employeeRouter = require("./router/employee");

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

app.use("/api/employee", employeeRouter);

