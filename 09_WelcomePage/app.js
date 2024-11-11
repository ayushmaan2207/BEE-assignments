const express = require('express');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

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

// Route for products page
app.get('/products', (req, res) => {
    const data = {
        title: "Products",
        message: "Welcome to the Products Page!"
    };
    res.render('products', data); // Ensure you create a products.ejs file in the views folder
});

// Start the server
const PORT = 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
