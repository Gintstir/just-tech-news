const { Model, Datatypes, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create user model
class User extends Model {}

//define table columns and configuration
User.init(
    {
        //TABLE COLUMN DEFINITIONS GO HERE
        //define an id column
        id: {
            //use the special sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQLs 'NOT NULL' option
            allowNull: false,
            //instruct that this is the Primary Key
            primaryKey: true,
            //enable auto increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating th table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNUll: false,
            validate: {
                //this means the password must be atleast four characters long
                len: [4]
            }
        }
    },
    {
        //TABLE CONFIGURATION OPTIONS GO HERE ((https://sequelize.org/v5/manual/models-definition.html#configuration))

        //pass in our  imported sequelize conneciton (the direct connection to our database)
        sequelize,
        //Dont automaticlly create createdAt/updatedAt timestamp fields
        timestamps: false,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing (ie 'comment_text and not commentText)
        underscored: true,
        //make it so out model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;