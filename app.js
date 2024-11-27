const express = require('express');
const path = require('path');
const connectDB = require('./init/db');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { Server } = require('socket.io');
const http = require('http');
const session = require('express-session');
const methodoverride=require("method-override");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method')); 

// EJS configuration
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Pass Socket.IO to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// MongoDB connection
connectDB();
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // You can set this to `true` if you use HTTPS
}));

// Middleware to set user in res.locals
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user; // Store user info in res.locals
        res.locals.isAdmin = req.session.user.role === 'admin'; // Set isAdmin flag
    } else {
        res.locals.user = null;
        res.locals.isAdmin = false;
    }
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(middleware.route);
    }
});

// Routes
app.use('/', userRoutes);
app.use('/employees', employeeRoutes);

app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    next();
});

// Frontend routes
// app.get('/home', (req, res) => res.render('/employees/home'));
// app.get('/employees', async (req, res) => {
//     try {
//         const Employee = require('./models/Employee');
//         const employees = await Employee.find().sort({ createDate: -1 });

//         console.log('Body value:', './employees/list');
//         console.log('Employees fetched:', employees);

//         res.render('layouts/main', {
//             title: 'Employee List',
//             body: './employees/list', // Path to the partial
//             employees: employees,
//         });
//     } catch (error) {
//         console.error('Route error:', error.stack);
//         res.status(500).send('Internal Server Error');
//     }
// });


// app.get('/employees/edit/:id', async (req, res) => {
//     const Employee = require('./models/Employee');
//     const employee = await Employee.findById(req.params.id);
//     res.render('layouts/main', {
//         title: 'Edit Employee',
//         body: 'employees/edit',
//         employee: employee
//     });
// });


const PORT = 5000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
