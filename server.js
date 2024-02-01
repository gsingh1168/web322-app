/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: __Pushapdeep Singh Khural____________________ 
Student ID: ___142557222___________ 
Date: __31 Jan, 2023______________
Cyclic Web App URL: ____https://tan-strange-lion.cyclic.app___________________________________________________
GitHub Repository URL: ____https://github.com/DeepSingh03/web322-app.git__________________________________________________

********************************************************************************/ 

const express = require('express');
const path = require('path');
const storeService = require('./store-service'); 
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
app.use(express.static('public'));

app.get('/', (req, res) => {
   
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/about', (req, res) => {
    
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then((publishedItems) => {
            res.json(publishedItems);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

app.get('/items', (req, res) => {
    storeService.getItems()
        .then((allItems) => {
            res.json(allItems);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then((allCategories) => {
            res.json(allCategories);
        })
        .catch((err) => {
            res.status(500).send({ message: err });
        });
});

storeService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`Express http server listening on port ${HTTP_PORT}`)); 
    })
    .catch((err) => {
        console.error(`Error initializing store-service: ${err}`); 
    });