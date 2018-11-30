var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./mysql');
var router = express.Router();
var config = require('./appconfig')
var path = require('path');
var logger = require('morgan');

var app = express();

// var products = require('./0.1.1/products');

// dir Setting
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));


// api version
var version = {
    v011 : express.Router(),
}

// version 0.1.1
version.v011.use('/capston', function(req, res, next){next();}, require('./0.1.1/capston'));

// api Setting
app.use('/api/v0.1.1', version.v011);
app.use('/api/?', function(req, res, next) {
    next(console.log('Not Found'));
});


app.get('/', function(request, response){
    fs.readFile('index.html', 'utf8', function(error, data){
        console.log('Open Index');
        response.send(data);
    });
});

app.listen(52273, function(){
    console.log('Sever On');
});

module.exports = router;