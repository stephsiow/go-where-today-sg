const bodyParser = require("body-parser");
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

// Proxy OpenAI 
app.post("/openai-api", (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY; 
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(req.body)
    })
    .then(openAiResponse => openAiResponse.json())
    .then(jsonRes => {
        console.log(jsonRes);
        res.json(jsonRes);
    })
    .catch(error => {
        res.json({
            error: error,
            message: "Error occurred on OpenAi API"
        })
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use("/api/response", ResponseRoute);
