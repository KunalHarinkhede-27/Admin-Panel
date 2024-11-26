const jwt = require('jsonwebtoken');

// This is the basic authentication middleware for JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'secretKey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Middleware to check the role of the user
const requireRole = (role) => (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Middleware to ensure the user is authenticated (logged in)
const ensureAuthenticated = (req, res, next) => {
    console.log('Middleware triggered.');
    console.log('Session User:', req.session.user); // Debugging
    if (req.session && req.session.user) {
        console.log('User authenticated:', req.session.user);
        return next(); // Proceed to the next middleware/route
    }
    console.log('User not authenticated. Redirecting...');
    res.redirect('/login'); // Redirect unauthenticated users
};

module.exports = {
    authenticate,
    ensureAuthenticated,
    requireRole
};
