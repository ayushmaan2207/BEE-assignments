const mongoose = require("mongoose");

// Replace with your actual MongoDB connection string
const mongoURL = "mongodb://localhost:27017/WelcomePage";

// Set up connection
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL); // Removed deprecated options
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed", err);
    }
};

connectDB();

mongoose.connection.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

module.exports = mongoose.connection;
