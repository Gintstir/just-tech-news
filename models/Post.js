const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create our post model

class Post extends Model {}


//in the first parameter we definet he post schema.  id column is set to primary key and auto
//increment.  We define title as a string value.  Sequelize offers validation in the schema definition
// so we set isURL to true.  user_id column is to determine who posted the news article.  
//references property establishes relationship  btw this post and the user by creating a reference
//to the User model, specifically to the id column that is defined by the key property.
//The user_id is defined as the foreign key and will be the matching link.  
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allownull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;