//this file is responsible for importing the User model and exporting an object with it as a property.  

const User = require('./User');
const Post = require('./Post');

//create associations - a user can have many posts but a post can only have one user making this a One-to-many relationship.
//Thanks to Sequelize, we can now use JavaScript to explicitly create this relation. This association creates the reference
//for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});


//we also need to make the the reverse association as above:
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post };