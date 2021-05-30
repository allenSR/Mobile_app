const mysql = require('mysql2');


const pool = mysql.createPool({
    host: '192.168.0.103',
    user: 'myuser',
    password: 'secret',
    database: 'todolistdb'
})

/*const pool = mysql.createPool({
    host: 'localhost',
    user: 'myuser',
    password: 'secret',
    database: 'todolistdb'
})*/

module.exports = pool;