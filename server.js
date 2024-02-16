/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: _Gurkirat Singh_____
Student ID: ___144886223_____
Date: ____node31, Jan 2024_____
Cyclic Web App URL: https://glamorous-worm-nightgown.cyclic.app/about
GitHub Repository URL: https://github.com/gsingh1168/web322-app

********************************************************************************/ 

const express = require('express');
const path = require('path');
const storeService = require('./store-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'ddp0xnbij',
    api_key: 239939596444561,
    api_secret: 'In3I9CYHiLCQ42z9kWoFPHDCxVc',
    secure: true
});

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
    if (req.query.category) {
        // If category query exists
        storeService.getItemsByCategory(parseInt(req.query.category))
            .then(items => {
                res.json(items);
            })
            .catch(err => {
                res.status(500).json({ message: err });
            });
    } else if (req.query.minDate) {
        // If minDate query exists
        storeService.getItemsByMinDate(req.query.minDate)
            .then(items => {
                res.json(items);
            })
            .catch(err => {
                res.status(500).json({ message: err });
            });
    } else {
        // Default: return all items
        storeService.getAllItems()
            .then(items => {
                res.json(items);
            })
            .catch(err => {
                res.status(500).json({ message: err });
            });
    }
});

// Route to get item by id
app.get('/item/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    storeService.getItemById(itemId)
        .then(item => {
            res.json(item);
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

// Route to serve addItem.html
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
});

// Multer configuration for file upload
const upload = multer();

// Route to handle adding an item
app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        // Function to upload image to Cloudinary
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        // Function to upload image and process item
        async function uploadImage(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        // Upload image and process item
        uploadImage(req).then((uploaded) => {
            processItem(uploaded.url);
        });
    } else {
        // If no image uploaded, process item without image
        processItem("");
    }
});

// Function to process item after image upload
function processItem(imageUrl) {
    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    req.body.featureImage = imageUrl;
    // Further processing logic here
    // After processing, you can redirect to /items or send a response as needed
    res.redirect('/items');
}

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
