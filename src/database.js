const mysql = require('mysql');
const { database } = require('./keys');
const { connect } = require('./routes');
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Coneción con la base de datos perdida');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Muchas conexiones en la base de datos');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Conección con la base de datos rechazada');
        }
    }
    if (connection) connection.release();
    console.log('Conectado a la DB');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;