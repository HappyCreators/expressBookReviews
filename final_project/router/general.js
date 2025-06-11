const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//TASK 6
//Registering a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    //Check that username and password are provided
    if (!username || !password){
      return res.status(404).json({ message: "Username and password are required" });
    }

    //Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists){
       return res.status(409).json({ message: "Username already exists" });
    }
    //Register new user and send response
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfuly" });
}); 


//TASK 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  res.send(JSON.stringify({books}, null, 4));
});


//TASK 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book){
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });


//TASK 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author; // 1. Get the author name from the URL
    const bookKeys = Object.keys(books);  // 2. Get all the keys (ISBNs) from the books object

//Filter books where the author matches (case-insensitive match is safer)
    const matchingBooks = bookKeys
        .map((isbn) => books[isbn])
        .filter((book) => book.author.toLowerCase() === author.toLowerCase());

//Return the result
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found for the specified author" });
    }
});

//TASK 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; // 1. Get the title from the URL
    const bookKeys = Object.keys(books);  // 2. Get all the keys (ISBNs) from the books object

//Filter books where the title matches (case-insensitive match is safer)
    const matchingBooks = bookKeys
        .map((isbn) => books[isbn])
        .filter((book) => book.title.toLowerCase() === title.toLowerCase());

//Return the result
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found for the specified title" });
    }
});

//TASK 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const reviews = book.reviews;
  
    if (!reviews || Object.keys(reviews).length === 0) {
      return res.json({ message: "This book has no reviews yet." });
    }
  
    res.json(reviews);
});

module.exports.general = public_users;


////FINAL TASKS USING PROMISE CALLBACKS//////////

// TASK 10 - TASK 1 WITH PROMISES
//Get the book list available in the shop using a Promise
public_users.get('/', function (req, res) {
    // Create a promise that resolves the books data after 2 seconds
    let getBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 2000); // Simulate delay
    });

    console.log("Before resolving books promise");

    getBooksPromise
        .then((bookList) => {
            console.log("Books promise resolved");
            res.send(JSON.stringify({ books: bookList }, null, 4));
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching books", error: error.message });
        });

    console.log("After calling books promise");
});

// TASK 11 - Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Create a promise to simulate async book retrieval
    const getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        }, 1000); // Simulated 1-second delay
    });

    getBookByISBN
        .then((book) => {
            res.json(book);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message });
        });
});

//TASK 12 - Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Create a promise to simulate async search
    const getBooksByAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookKeys = Object.keys(books);
            const matchingBooks = bookKeys
                .map((isbn) => books[isbn])
                .filter((book) => book.author.toLowerCase() === author.toLowerCase());

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for the specified author"));
            }
        }, 1000); // Simulate delay
    });

    getBooksByAuthor
        .then((booksByAuthor) => {
            res.json(booksByAuthor);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message });
        });
});

// TASK 13 - Get book details based on title using Promise
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Create a promise to simulate async search
    const getBooksByTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookKeys = Object.keys(books);
            const matchingBooks = bookKeys
                .map((isbn) => books[isbn])
                .filter((book) => book.title.toLowerCase() === title.toLowerCase());

            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for the specified title"));
            }
        }, 1000); // Simulate delay
    });

    getBooksByTitle
        .then((booksByTitle) => {
            res.json(booksByTitle);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message });
        });
});
