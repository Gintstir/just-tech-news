const router = require('express').Router();

const { User } = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    //access our User model and run .findAll() method
    //sequelize is a JavaScript promise based library meaning we can use .then() 
    //the .findAll() method lets us query all of the users from the user table in the database,
    //this is the SQL query equiv of SELECT * FROM users;

    //Notice how we now pass an object into the method like we do with the .findOne() method.
    //This time, we've provided an attributes key and instructed the query to exclude the password column.
    //It's in an array because if we want to exclude more than one, we can just add more.

    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET /api/users/1
// passing an argument into the .findOne() method, using the where option to indicate we want to find a user where its id value equals whatever req.params.is
// this is just like the MySQL query syntax : SELECT * FROM users WHERE id = 1;
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//POST /api/users
// the sequelize .create() method is used here instead of INSERT INTO users (username, email, password) VALUES ('exampleUserName', 'example@email.com', 'password12345')
router.post('/', (req, res) => {
    //expect {username: 'exampleUserName', email: 'example@email.com', password: 'password12345'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//PUT /api/users/1
//This .update() method combines the parameters for creating data and looking up data. We pass in req.body
//to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used.
// The associated SQL syntax would look like the following code:
// UPDATE users
// SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
// WHERE id = 1;
router.put('/:id', (req, res) => {
    //expects {username: 'exampleUserName', email: 'example@email.com', password: 'password12345'}

    //if req.body has exact key/value pairs to match the model, you can just use req.body instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//DELETE /api/users/1
//To delete data, use the .destroy() method
//and provide some type of identifier to indicate where exactly we would like to delete data from the user database table.
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;