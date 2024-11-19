const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require("./db");
const Student = require('./models/Student'); // Ensure correct path to Student model

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Set storage engine for Multer (for file uploads, if needed)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append date to filename
    }
});

// Initialize upload
const upload = multer({ storage: storage });

// Tasks routes (your previous to-do list functionality)
let tasks = [];

// Route for the homepage with loader and to-do list
app.get('/', (req, res) => {
    const data = {
        title: "Dynamic Page with To-Do List",
        message: "Welcome to the page!",
        tasks
    };
    res.render('index', data);
});

// Route to add a task
app.post('/todo/add', (req, res) => {
    const task = req.body.task;
    if (task) {
        tasks.push(task);
    }
    res.redirect('/');
});

// Route to delete a task
app.post('/todo/delete', (req, res) => {
    const taskToDelete = req.body.taskToDelete;
    tasks = tasks.filter(task => task !== taskToDelete);
    res.redirect('/');
});

// Route for products page with upload functionality
app.get('/products', (req, res) => {
    const uploadedImage = req.query.filename || null; // Get the filename from query params
    const data = {
        title: "Products",
        message: "Welcome to the Products Page!",
        uploadedImage // Pass the filename to the view
    };
    res.render('products', data); // Render products.ejs
});

// Route to handle image upload
app.post('/products/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Redirect to products page with the filename
    res.redirect(`/products?filename=${req.file.filename}`);
});

// Route to display the contact page
app.get('/contact', (req, res) => {
    const data = {
        title: "Contact Us",
        message: "We would love to hear from you!"
    };
    res.render('contact', data);
});

// Route to handle form submission from the contact page
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact Form Submission:", { name, email, message });
    res.render('output', { message });
});

// ** New Routes for Students Management **

// Route to view students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('studentList', { students });
    } catch (err) {
        res.status(500).send('Error retrieving students: ' + err);
    }
});

// Route to show the add student form
app.get('/students/add', (req, res) => {
    res.render('addStudent');
});

// Route to handle adding a new student
app.post('/students/add', async (req, res) => {
    const { name, age, grade, courses } = req.body;
    const student = new Student({
        name,
        age,
        grade,
        courses: courses.split(',').map(course => ({ name: course.trim() })) // Assuming courses are separated by commas
    });
    try {
        await student.save();
        res.redirect('/students');
    } catch (err) {
        res.status(500).send('Error adding student: ' + err);
    }
});

// Route to show the edit student form
app.get('/students/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('editStudent', { student });
    } catch (err) {
        res.status(500).send('Error retrieving student: ' + err);
    }
});

// Route to handle editing an existing student
app.post('/students/edit/:id', async (req, res) => {
    const { name, age, grade, courses } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, {
            name,
            age,
            grade,
            courses: courses.split(',').map(course => ({ name: course.trim() }))
        });
        res.redirect('/students');
    } catch (err) {
        res.status(500).send('Error updating student: ' + err);
    }
});

// Route to delete a student
app.post('/students/delete/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (err) {
        res.status(500).send('Error deleting student: ' + err);
    }
});

// Start the server
const PORT = 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
