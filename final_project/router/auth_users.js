const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//TASK 7
const isValid = (username)=>{ //returns boolean
     return typeof username === 'string' && username.trim() !== '';
};

const authenticatedUser = (username,password)=>{ //returns boolean
     return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Retrieve username and password from req url
    const username = req.body.username;
    const password = req.body.password;

    //Check is username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    //Check username exists and credentials match
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    //Generate JWT access token
    const accessToken = jwt.sign(
        { username },
        'access',
        { expiresIn: 60*60 }
    );

    //Store accestoken in session
    req.session.authorization = {
        accessToken
    };

    return res.status(200).send("User successfully logged in");
});


//TASK 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // Check if review is provided in query
    if (!review) {
      return res.status(400).json({ message: "Review text is required as a query parameter." });
    }
  
    // Extract username from session JWT
    let username;
    try {
      const token = req.session.authorization?.accessToken;
      if (!token) {
        return res.status(401).json({ message: "User not authenticated." });
      }
  
      const decoded = jwt.verify(token, 'access');
      username = decoded.username;
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  
    // Check if the book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // Initialize the reviews object if not present
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // Add or update review
    book.reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully.",
      reviews: book.reviews
    });
  });

//TASK 9
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Extract JWT token from session
    let username;
    try {
        const token = req.session.authorization?.accessToken;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const decoded = jwt.verify(token, 'access');
        username = decoded.username;
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if user has a review to delete
    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "No review found for this user." });
    }

    // Delete the user's review
    delete book.reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully.",
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
