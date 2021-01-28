//this file is responsible for importing the User model and exporting an object with it as a property.  

const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');

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


//we're allowing both the User and Post models to query each other's information in the context of a vote. If we want to which
//users voted on a single post, we can now do that.  If we want to see which posts a single user voted on we can see that too.
//We instruvt the application that the user and post models will be connected through the Vote model.  We stat that we want the 
//foreign key to be in Vote which aligns with the fields we set up in the model.  also instructed Vote model should display at voted_post when queried.

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };