const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/signup',(req,res,next)=>{
    next();
}, userController.renderSignupPage);  // Render the signup page
router.get('/login', (req, res, next) => {
    console.log('Reached /login route');
    next();
}, userController.renderLoginPage);    // Render the login page

router.post('/signup', userController.signup);           // Handle signup logic
router.post('/login', userController.login);  

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.redirect('/login'); // Redirect to login page
    });
});// Handle login logic

module.exports = router;
