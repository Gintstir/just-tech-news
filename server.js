const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
//this allows access to the css file we added
const path = require('path');
//this sets up Handlebars.js functionality
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});



//=====================================

const app = express();
const PORT = process.env.PORT || 3001;

//=====================================

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//this is an express.js middleware function that can take all of the contents of a folder and serve them as
//static assets. This is useful for front end specific files like images, style sheets, and javascript files.
app.use(express.static(path.join(__dirname, 'public')));

//turn on routes
app.use(routes);


//turn on connection to db and server
//we use the sequelize.sync() method to establish the connection to the database
//The "sync" part means that this is Sequelize taking the models and connecting
//them to associated database tables. If it doesn't find a table, it'll create it for you!
//By setting 'force' to 'true' the Database connection must sync with the model definitions and associations.
//By forcing the sync method to true we will make the tables recreate if there are any association changes.  
//This is similar to the MySQL syntax 'DROP TABLE IF EXISTS'

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on Port: ${PORT}`))

    /**The other thing to notice is the use of {force: false} in the .sync() method.
    This doesn't have to be included, but if it were set to true, it would drop and
    re-create all of the database tables on startup. This is great for when we make
    changes to the Sequelize models, as the database would need a way to understand
    that something has changed. We'll have to do that a few times throughout this
    project, so it's best to keep the {force: false} there for now. */
})
