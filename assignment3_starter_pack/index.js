//Sample for Assignment 3
const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();

const apiPath = "/api/";
const version = "v1";

const port = 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//Set Cors-related headers to prevent blocking of local requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Tracking the id of Genre and Book id
let nextGenreId = 5;
let nextBookId = 4;

const genres = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Non-Fiction" },
  { id: 3, name: "Science Fiction" },
  { id: 4, name: "Fantasy" },
];

const books = [
  { id: 1, 
    title: "Pride and Prejudice", 
    author: "Jane Austin", 
    genreId: 1 },
  {
    id: 2,
    title: "Independent People",
    author: "Halldór Laxnes",
    genreId: 1,
  },
  {
    id: 3,
    title: "Brief Answers to the Big Questions",
    author: "Stephen Hawking",
    genreId: 2,
  },
];

/* YOUR CODE STARTS HERE */


/*  --START--  All Book endpoints  --START--  */ 

// GET ALL BOOKS
// Read all books
// GET http://localhost:3000/api/v1/books
// Output and status code: 501 Not Implemented - list of Books
app.get(apiPath + version + "/books", (req, res) => {
  res.status(200).json(books);
});


// GET A SINGLE BOOK
// Read a single book
// GET http://localhost:3000/api/v1/books/:genreId/
// Input: None
// Output and status code: 501 Not Implemented - list of Books
app.get(apiPath + version + "/genres/:genreId/books/bookId", (req, res) => {
  // TODO: Implement GET ALL Books
  res.status(501).json({ message: "This endpoint has not been implemented yet"});
});


// CREATE A NEW BOOK
// Read a single book
// GET http://localhost:3000/api/v1/books/:genreId/
// Input: None
// Output and status code: 501 Not Implemented - list of Books
app.post(apiPath + version + "/genres/books", (req, res) => {
  // TODO: Implement GET ALL Books
  res.status(501).json({ message: "This endpoint has not been implemented yet"});
});


// PARTIALLY UPDATE A BOOK
// Read a single book
// GET http://localhost:3000/api/v1/books/:genreId/
// Input: None
// Output and status code: 501 Not Implemented - list of Books
app.get(apiPath + version + "/genres/:genreId/books/bookId", (req, res) => {
  // TODO: Implement GET ALL Books
  res.status(501).json({ message: "This endpoint has not been implemented yet"});
});


// DELETE A BOOK 
// Read a single book
// GET http://localhost:3000/api/v1/books/:genreId/
// Input: None
// Output and status code: 501 Not Implemented - list of Books
app.get(apiPath + version + "/genres/:genreId/books/bookId", (req, res) => {
  // TODO: Implement GET ALL Books
  res.status(501).json({ message: "This endpoint has not been implemented yet"});
});


/*  --END--  All Book endpoints  --END--  */ 

/*  --START--  All Genres endpoints  --START--  */ 

// GET ALL GENRES
// Read all genres
// GET http://localhost:3000/api/v1/genres
// Output and status code: 200 OK - list of genres 
app.get(apiPath + version + "/genres", (req, res) => {
  res.status(200).json(genres);
});


// CREATE A NEW GENRE
// Create a new genre
// POST http://localhost:3000/api/v1/genres
// Output and status code: 201 - Create
app.post(apiPath + version + "/genres", (req, res) => {
  // Validate the body
  if (
    !req.body || // Check if there is a body
    !req.body.name || // Checks if the name exists in the body
    typeof req.body.name !== "string"
  ) {
    return res // If any condition is true then return this error message
              .status(400)
              .json({message: "Genres require a name"});
  }

  // create the new genre
  const newGenre = {
    id: String(nextGenreId),
    name: String(req.body.name)
  };

  // check if the genre already exists
  if (genres.some((genre) => genre.name === newGenre.name)) {
    // if it does, return an error message
    return res
              .status(400)
              .json({message: `A genre with the name ${newGenre.name} already exists`});
  }

  // Push the new genre, add to the genreIdCounter
  genres.push(newGenre)
  nextGenreId++;

  res.status(201).json(newGenre);
});

/* 


    WHAT THE ************ IS THIS ???



*/

// DELETE A GENRE
// Delete a genre
// GET http://localhost:3000/api/v1/genres/:genreId
// Input: None
// Output and status code: 501 Not Implemented - list of genres 
app.get(apiPath + version + "/genres", (req, res) => {
  // TODO: Implement GET ALL GENRES
  res.status(501).json({ message: "This endpoint has not been implemented yet"});
});


/*  --END--  All Genres endpoints  --END--  */ 

/* YOUR CODE ENDS HERE */

/* DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app; // Export the app
