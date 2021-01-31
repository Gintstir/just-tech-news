const router = require('express').Router();

//bc we hookep up a template engine we can use res.render and specify which template we want to use
router.get('/', (req, res) => {
    res.render('homepage');
});

module.exports = router;