const router = require('express').Router();

const { User, Post, Vote } = require('../../models');

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
        },
        include: [
            {
                model: Post,
                attributes: [
                    'id',
                    'title',
                    'post_url',
                    'created_at'
                ]
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
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


//we query the user table using the findOne() method for the email entered by the user and assigned it to req.body.email
//if the user's email was not found a message is sent back.  If it is found the next step will be to verify the user's identity by
//matching the pw from the user and hashed pw in the database. this will be done in the promise of the query.  

/* Using the keyword this, we can access this user's properties, including the password, which was stored as a hashed string.
Now that we have the instance method in place, let's return to look at the code in the /login route in user-routes.js.
The .findOne() Sequelize method looks for a user with the specified email. The result of the query is passed as dbUserData
to the .then() part of the .findOne() method. If the query result is successful (i.e., not empty), we can call .checkPassword(),
which will be on the dbUserData object. We'll need to pass the plaintext password, which is stored in req.body.password,
into .checkPassword() as the argument. The .compareSync() method, which is inside the .checkPassword() method, can then confirm
or deny that the supplied password matches the hashed password stored on the object. .checkPassword() will then return true on success
or false on failure. We'll store that boolean value to the variable validPassword. */

router.post('/login', (req, res) => {
    //expects {email: 'user@email.com, password: 'password12345'}
    User.findOne({

        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: "No such user with that email address!" });
            return;
        }

        //res.json({ user: dbUserData })

        //verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        res.json({ user: dbUserData, message: 'You are now logged in!' });

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