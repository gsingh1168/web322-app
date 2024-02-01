/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: _Gurkirat Singh_____
Student ID: ___144886223____
Date: ____node31, Jan 2024____
Cyclic Web App URL: https://glamorous-worm-nightgown.cyclic.app/about
GitHub Repository URL: https://github.com/gsingh1168/web322-app

********************************************************************************/ 
const express = require('express');
const path = require('path');
const storeService = require('./store-service');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Redirect "/" route to "/about"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve about.html from the 'views' directory for "/about" route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to get all items with published==true
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(items => {
            res.json(items);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Route to get all items
app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(items => {
            res.json(items);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Route to get all categories
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Initialize data before starting the server
storeService.initialize()
    .then(() => {
        // Start the server if data initialization is successful
        app.listen(HTTP_PORT, () => {
            console.log(`Express http server listening on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        // Output the error to the console if data initialization fails
        console.error("Error initializing data:", err);
    });
