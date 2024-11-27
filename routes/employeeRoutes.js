const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const employeeController = require('../controllers/employeeController');
const { ensureAuthenticated, requireRole } = require('../utils/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name based on current timestamp
    },
});

const upload = multer({ storage: storage });

// Main page (no authentication needed)
router.get('/', employeeController.getAllEmployees);
router.get('/home',employeeController.gethomepage);

// Authentication-protected routes
router.get('/create', ensureAuthenticated, requireRole('admin'), employeeController.renderCreatePage);
router.post('/create', upload.single('image'), ensureAuthenticated, requireRole('admin'), employeeController.createEmployee);
router.get('/edit/:id', ensureAuthenticated, requireRole('admin'), employeeController.renderEditPage);
router.patch('/edit/:id', ensureAuthenticated,  requireRole('admin'), employeeController.editEmployee);
router.delete('/delete/:id', ensureAuthenticated, employeeController.deleteEmployee);

module.exports = router;
