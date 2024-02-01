const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        // Use Promise.all to wait for both readFile operations to complete
        Promise.all([
            // Reading items.json
            fs.promises.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8').then(data => {
                items = JSON.parse(data);
            }),
            // Reading categories.json
            fs.promises.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8').then(data => {
                categories = JSON.parse(data);
            })
        ]).then(() => {
            resolve("Successfully initialized data.");
        }).catch(err => {
            reject("Failed to initialize data: " + err);
        });
    });
};

module.exports.getAllItems = function() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject("No items returned");
        } else {
            resolve(items);
        }
    });
};

module.exports.getPublishedItems = function() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) {
            reject("No published items returned");
        } else {
            resolve(publishedItems);
        }
    });
};

module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("No categories returned");
        } else {
            resolve(categories);
        }
    });
};