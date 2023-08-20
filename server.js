const bodyParser = require("body-parser");
const { Console } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const ResponseRoute = require('./database/routes/response');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB 
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('Database Connection Established!');
});

// Serve the frontend
app.use(express.static(path.join(__dirname, '/frontend')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use("/api/response", ResponseRoute);
