const Response = require('../models/Response');

//Show the list of Responses 
const index = (req, res, next) => {
    Response
        .find()
        .sort({createdAt: -1})
        .limit(5)
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: "An error occurred!"
            })
        })
}

const show = (req, res, next) => {
    let responseID = req.body.responseID
    Response.findById(responseID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: "An error occurred!"
        })
    })
}

const store = (req, res, next) => {
    let response = new Response({
        weather: req.body.weather,
        childAge: req.body.childAge,
        text: req.body.text
    })
    response.save()
    .then(response => {
        res.json({
            message: 'Response added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occurred!'
        })
    })
}

module.exports = { index, show, store }