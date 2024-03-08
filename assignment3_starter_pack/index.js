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


// GET ALL BOOKS // TODO : THIS WORKS !!! DO NOT CHANGE !!!
// GET http://localhost:3000/api/v1/books
// Output and status code: 200 OK 
app.get(apiPath + version + "/books", (req, res) => {
    // Check the 'filter' query parameter is provided
    if (!req.query.filter) {

        // Check if the 'filter' is spelled correctly
        const allowedQueryParameters = ['filter']
        const queryParameters = Object.keys(req.query)
        const invalidParametes = queryParameters.filter(b => !allowedQueryParameters.includes(b))
        
        if (invalidParametes.length > 0){
            return res.status(400).json({ message: 'Invalid input. Only "filter" paramieter is allowed'})
        }
        
        // If there is no filter return the unaltered books array
        return res.status(200).json(books)
    } else {
        // If the 'filter' is provided, find the bookId
        const genre = genres.find(
            (genre) =>  genre.name.toLowerCase() === req.query.filter.toLowerCase()
        );

        if (!genre) {
            return res.status(200).json([])
        }

        // Filter the books to find all instances of books with the genre.id
        const filterBooks = books.filter((b) => parseInt(b.genreId) === genre.id);
        
        // Return the found books
        res.status(200).json(filterBooks);
    }
});


// GET A SINGLE BOOK // TODO : THIS WORKS !!! DO NOT CHANGE !!!
// GET http://localhost:3000/api/v1/books/:genreId/
// Output and status code: 200 OK - One book
app.get(apiPath + version + "/genres/:genreId/books/:bookId", (req, res) => {
    try {
      // Extract both genreId and bookId from the URl
      const {genreId, bookId} = req.params;
  
      // Checks if the genre exists, with checking the url genreID with every id in the arrays
      const genreExists = genres.find(genre => genre.id === parseInt(genreId));
  
      if (!genreExists) {
        // Sends a 404 Not Found status if no genre is found
        return res.status(404).json({ message: "Genre not found." });
      }
  
      // Checks if the book in the URL exists, with checking the url bookID with every id in the arrays and then secondly with an AND (&&) checks if the book.genreID matches the genreID in genres
      const book = books.find(book => book.id === parseInt(bookId) && book.genreId === parseInt(genreId));
  
      if (book) {
        // Sends a 200 OK status with the individual book data
        res.status(200).json(book);
      } else {
        // Sends a 404 Not Found status if no book is found
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      // Sends a 500 Error status if there is no book in the array
      res.status(500).json({ message: "Error while fetching the book." });
    }
});


// CREATE A NEW BOOK // TODO: THIS WORKS !!! DO NOT CHANGE !!!
// POST http://localhost:3000/api/v1/books/
// Output and status code: 201 created
app.post(apiPath + version + "/books", (req, res) => {
    // validate the information of the request
    if (
        !req.body || // check if there is any information 
        !req.body.title || // Check if there is a title
        !req.body.author || // Check if there is an author
        typeof req.body.title !== "string" || // Check for the type of title 
        typeof req.body.author !== "string" // Check for the type of author 
    )   {
    return res // If any condition is true then return this error message
              .status(400)
              .json({message: "Books require both a title and an author"});
    }

    // Check if the genreId exists
    const genreExists = genres.find(genre => genre.id === parseInt(req.body.genreId));
    
    if(!genreExists){
        return res.status(400).json({ message: "Bad Request: genre not found" });
    }

    // Create the new book
    const newBook = {
        id: parseInt(nextBookId),
        title: String(req.body.title),
        author: String(req.body.author),
        genreId: parseInt(req.body.genreId, 10),
    }

    // Push the new book, add to the nextBookId
    books.push(newBook)
    nextBookId++;

    res.status(201).json(newBook)
});


// PARTIALLY UPDATE A BOOK // TODO: Finish...
// PATCH http://localhost:3000/api/v1/genres/:genreId/books/bookId
// Output and status code: 200 OK
app.patch(apiPath + version + "/genres/:genreId/books/:bookId", (req, res) => {
    const { bookId, genreId } = req.params;
    // Get the title, author, and genreId from the request body
    const { title, author, newGenreId } = req.body;
  
    const genreIDInt = parseInt(genreId, 10); // 10 gives us the decimal number of the bookIDInt
    const bookIDInt = parseInt(bookId, 10); // 10 gives us the decimal number of the bookIDInt
  
    // checks if given bookId, genreId and the newGenreId is a number
    if (isNaN(genreIDInt )|| isNaN(bookIDInt)) {
      return res.status(400).json({ message: "Given Id has to be an integerr." });
    }
  
    // checks if the genreId valid and exists
    const genre = genres.find((genre) => genre.id === parseInt(genreIDInt));
    if (!genre) {
      return res.status(404).json({ message: "The genreId given is not valid for a existing genre ." });
    }
  
    // checks if bookId is valid and exists
    const book = books.find((book) => book.id === parseInt(bookIDInt));
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // checks if the book is accociated with the genre
    if (book.genreId !== parseInt(genreIDInt)) {
      return res.status(404).json({ message: "Book not found in genre." });
    }
  
    // Updates the title
    if (title) {
      book.title = title;
    }
  
    // updates the author
    if (author) {
      book.author = author;
    }
  
    // updates the genreId
    if (newGenreId) {
      book.genreId = newGenreId;
    }
  
    // returns the updated book and sends a 200 ok status
    res.status(200).json(book);
});

/* app.patch(apiPath + version + "/genres/:genreId/books/:bookId", (req, res) => {
    const { genreId, bookId } = req.params;
    const { newTitle, newAuthor } = req.body;

    // Find the book corresponding to the bookId
    const book = books.find(book => book.id === parseInt(bookId));
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if there is a genreId. i.e. genreId != null
    if (genreId !== undefined) {
        book.genreId = genreId;
    } // Else do nothing

    // Check if there is a new title
    if (newTitle !== undefined) {
        book.title = newTitle;
    } // Else do nothing

    // Check if there is a new author
    if (newAuthor !== undefined) {
        book.author = newAuthor;
    } // Else do nothing

    console.log(req.params);
    console.log(req.body);
    console.log(`BookID: ${bookId} | Title: ${newTitle} | Author: ${newAuthor} | GenreId: ${genreId} |`);
    console.log(book);

    // Check if the book's genre matches the genreId provided in the request
    // if (book.genreId !== parseInt(genreId)) {
    //   return res.status(404).json({ message: "Mismatch between the book's genre and the provided genreId." });
    // }
    books.push(book)
    res.status(200).json(book);
}); */


// DELETE A BOOK // TODO: THIS WORKS !!! DO NOT CHANGE !!!
// DELETE http://localhost:3000/api/v1/books/:bookId
// Output and status code: 200 OK
app.delete(apiPath + version + "/books/:bookId", (req, res) => {
    const bookId = req.params.bookId;
    
    // Check if the bookId has the correct format
    const validIdFormat = /^\d+$/; // Using regular expression for numeric ID's

    if (!bookId || !validIdFormat.test(bookId)) {
        return res.status(400).json({ message: `Invalid Input. Please only use numbers`})
    }

    // Check if the bookId variable is empty
    if (!bookId) {
        return res.status(405).json({ message: 'Invalid Input. bookId is required' });
    };

    const deletedBookId = books.findIndex(
        (book) => parseInt(book.id) === parseInt(req.params.bookId)
    );

    if (deletedBookId === -1) {
        return res.status(404).json({ message: `Book with id ${req.params.bookId} does not exists`});
    };

    // Expected return
    const deletedBook = books[deletedBookId];
    books.splice(deletedBookId, deletedBookId + 1);
    return res.status(200).json(deletedBook)

});


/*  --END--  All Book endpoints  --END--  */ 

/*  --START--  All Genres endpoints  --START--  */


// GET ALL GENRES // TODO: THIS WORKS !!! DO NOT CHANGE !!!
// GET http://localhost:3000/api/v1/genres
// Output and status code: 200 OK - list of genres 
app.get(apiPath + version + "/genres", (req, res) => {
  res.status(200).json(genres);
});


// CREATE A NEW GENRE // TODO: THIS WORKS !!! DO NOT CHANGE !!!
// POST http://localhost:3000/api/v1/genres
// Output and status code: 201 - Create
app.post(apiPath + version + "/genres", (req, res) => {
  // Validate the body
  if (
    !req.body || // Check if there is a body
    !req.body.name || // Checks if the name exists in the body
    typeof req.body.name !== "string"
  ) {
      // If any condition is true then return this error message
      return res .status(400).json({message: "Genres require a name"});
  }

  // create the new genre
  const newGenre = {
    id: parseInt(nextGenreId),
    name: String(req.body.name)
  };

  // check if the genre already exists
  if (genres.some((genre) => genre.name.toLowerCase() === newGenre.name.toLowerCase())) {
    // if it does, return an error message
    return res.status(400).json({message: `A genre with the name ${newGenre.name} already exists`});
  }

  // Push the new genre, add to the nextGenreId
  genres.push(newGenre)
  nextGenreId++;

  res.status(201).json(newGenre);
});


// DELETE A GENRE // TODO: THIS WORKS !!! DO NOT CHANGE !!!
// DELETE http://localhost:3000/api/v1/genres/:genreId
// Output and status code: 200 OK
app.delete(apiPath + version + "/genres/:genreId", (req, res) => {
    const genreId = req.params.genreId;

    // Check if genreId is empty
    if (!genreId) {
        return res.status(405).json({ message: 'Invalid Input. genreId is required.' });
    }
    // Doont think that we need this ^^^^^^
    
    const deletedGenreId = genres.findIndex(
        (genre) => parseInt(genre.id) === parseInt(req.params.genreId)
    );

    if (deletedGenreId === -1) {
        return res.status(404).json({message: `Genre with id ${req.params.genreId} does not exists`});
    }
    
    const genreHasBooks = books.some((book) => parseInt(book.genreId) === parseInt(req.params.genreId)); 

    if (genreHasBooks) {
        return res.status(400).json({message : "Cannot delete genre, as it is used by at least one book"})
    }

    // Expected return
    const deletedGenre = genres[deletedGenreId];
    genres.splice(deletedGenreId, deletedGenreId + 1);
    return res.status(200).json(deletedGenre)
});


/* Handle bad requests */
// Handle genre deletion with no genreId
app.delete(apiPath + version + "/genres/", (req, res) => {
    return res.status(405).json({ message : "Method not allowed !" })
})

// Handle book deletion with no bookId
app.delete(apiPath + version + "/books/", (req, res) => {
    return res.status(405).json({ message : "Method not allowed !" })
})


/*  --END--  All Genres endpoints  --END--  */ 

/* YOUR CODE ENDS HERE */

/* DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app; // Export the app
