var mysql = require('mysql');
var config = require('./appconfig')
var pool;
var intervalId;

// Mysql 연동

// Mysql Pool Setting
var getPool = function(){
    if(pool){
        return pool;
    }

    console.log('Init Database');
    
    pool = mysql.createPool({
        user: config.mysql.userId,
        password: config.mysql.userPwd,
        port: config.mysql.port,
        database: config.mysql.database
    });

    
    var keepAlive = function () {
        pool.getConnection(function (err, connection) {
            if (err) {
                return;
            }
            connection.ping();
            connection.release();
        });
    };
    
    // setInterval(keepAlive, config.mysql.keepAliveTime);
    // // event define
    // pool.on('connection', function (connection) {
    //     console.log('Connection Event Occured');
    //     clearInterval(intervalId);
    //     intervalId = setInterval(keepAlive, config.mysql.keepAliveTime);
    // });
    return pool
}

module.exports = {
    getPool : getPool
};