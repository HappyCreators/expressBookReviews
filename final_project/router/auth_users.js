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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
