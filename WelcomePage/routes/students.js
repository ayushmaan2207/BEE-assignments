const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add a new student
router.post('/', async (req, res) => {
    try {
        const { name, age, grade, courses = [] } = req.body;

        if (!name || !age || !grade) {
            return res.status(400).json({ error: 'Name, age, and grade are required.' });
        }

        const newStudent = new Student({ name, age, grade, courses });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students with populated courses
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().populate('courses');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single student by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id).populate('courses');

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a student by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true }).populate('courses');

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a student by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json({ message: 'Student deleted successfully.', deletedStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
