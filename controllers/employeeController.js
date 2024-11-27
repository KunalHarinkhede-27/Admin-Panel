const Employee = require('../models/Employee'); // Assuming you have an employee model
const multer = require('multer');
const path = require('path');


const gethomepage=async (req,res)=>{
    try {
        const employees = await Employee.find({});
        res.render('employees/home', { employees, title: 'Home page' });
    } catch (error) {
        res.status(500).send('Error retrieving home page');
    }
}

// Get all employees (Main page)
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.render('employees/list', { employees, title: 'Employee List' });
    } catch (error) {
        res.status(500).send('Error retrieving employees');
    }
};

// Render Create Page
const renderCreatePage = (req, res) => {
    console.log('Rendering Create Page');
    res.render('employees/create', {
        title: 'Create Employee',
    });
};

// Create Employee
const createEmployee = async (req, res) => {
    try {
        const { uniqueId, name, email, mobile, designation, gender, course } = req.body;

        // Check if all required fields are provided
        if (!uniqueId || !name || !email || !mobile || !designation || !gender || !course) {
            return res.status(400).send('All fields are required');
        }

        // Check if file is uploaded
        const imagePath = req.file ? req.file.path : null; // Store image path if uploaded

        const newEmployee = new Employee({
            uniqueId,
            image: imagePath,
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            createDate: new Date(),
        });

        await newEmployee.save();
        res.redirect('/'); // Redirect to the main page or the employee list after successful creation
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).send('Error creating employee');
    }
};



// Render Edit Page
const renderEditPage = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).send('Employee not found');
        res.render('employees/edit', { employee, title: 'Edit Employee' });
    } catch (error) {
        res.status(500).send('Error rendering edit page');
    }
};

// Edit Employee
const editEmployee = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { id } = req.params;
        const updatedData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            designation: req.body.designation,
            gender: req.body.gender,
            course: req.body.course,
        };

        // If handling file uploads
        if (req.file) {
            updatedData.image = req.file.filename; // Add image filename to updated data
        }

        console.log('Uploaded file:', req.file);


        await Employee.findByIdAndUpdate(id, updatedData,  {new: true , runValidators: true,});
        res.redirect('/employees'); // Adjust redirection as needed
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating employee');
    }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.redirect('/'); // Redirect to main page
    } catch (error) {
        res.status(500).send('Error deleting employee');
    }
};

module.exports = {
    getAllEmployees,
    renderCreatePage,
    createEmployee,
    renderEditPage,
    editEmployee,
    deleteEmployee,
    gethomepage,
};
