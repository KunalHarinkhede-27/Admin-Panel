const User = require('../models/User');
const bcrypt = require('bcryptjs');

const renderSignupPage = (req, res) => {
    res.render('users/signup'); // Render signup page
};

const renderLoginPage = (req, res) => {
    res.render('users/login');  // Render login page
};

const signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request data
        const { name, email, password, confirmPassword, role } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return res.status(400).render('users/signup', { message: 'Passwords do not match' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already in use:", email);
            return res.status(400).render('users/signup', { message: 'Email already in use' });
        }

        // Hash the password
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user
        console.log("Creating new user...");
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        console.log("Signup successful:", newUser);
        res.redirect('/login'); // Redirect to login after success
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).render('users/signup', { message: 'Error registering user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('users/login', { message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('users/login', { message: 'Invalid password' });
        }

        // Redirect to main page on success
        req.session.user = { id: user._id, role: user.role };
        res.redirect('/employees'); // Ensure '/main' route exists and serves the main page
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).render('users/login', { message: 'Server error' });
    }
};

module.exports = { renderSignupPage, renderLoginPage, signup, login };
