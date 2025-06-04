const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    res.send(books[title]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
