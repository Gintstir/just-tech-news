//import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

//create connection to our database, pass in your mySQL information for UN and PW
//the 'new Sequelize()' function accepts the databse name, mysql un and pw respectively as params.  
let sequelize ;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;