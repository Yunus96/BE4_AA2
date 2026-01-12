const express = require("express");
const { initializeDatabase } = require("./db/db.connect.js");
const Movie = require("./models/movie.model.js");
const Hotel = require("./models/hotel.model.js");
const Book = require("./models/book.model.js");
const Recipe = require("./models/recipe.model.js");

const app = express();
// Middleware
app.use(express.json());
// Initialize the database connection
initializeDatabase();

//CORS configuration
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//
app.post("/recipe", async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Q6 of BE4_Assignment2
app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q7 of BE4_Assignment2
app.get("/title/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q8 of BE4_Assignment2
app.get("/author/:author", async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q9 of BE4_Assignment2
app.get("/difficulty/:difficulty", async (req, res) => {
  try {
    const recipes = await Recipe.find({ difficulty: req.params.difficulty });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q10 of BE4_Assignment2
app.put("/difficulty/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { difficulty: req.body.difficulty },
      { new: true },
    );

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Q11 of BE4_Assignment2
app.post("/time/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      {
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
      },
      { new: true },
    );

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Q12 of BE4_Assignment2
app.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Backend for BI1.1_CW

async function readAllMovies(){
  try{
    const allMovies = await Movie.find()
    return allMovies;
  } catch(error){
    throw error
  }
}
app.get("/movies", async (req, res) => {
  try{
      const movies = await readAllMovies()
 
      if(movies.length != 0){
        res.json(movies)
      } else {
        res.status(404).json({ error: "No movies found."})
      }
    } catch (error) {
      res.status(500).json({error: "Failed to fetch movies."})
    }
})

async function readMovieByTitle(movieTitle){
  try{
    const movie = await Movie.findOne({title: movieTitle})
    return movie;
  } catch(error){
    throw error
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
      const movie = await readMovieByTitle(req.params.title)
      if (movie) {
      res.json(movie)
    } else {
      res.status(484).json({ error: 'Movie not found.' })
    }} catch (error) {
      res.status(500).json({ error: "Failed to fetch movie." })
    }
});

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie)
    const saveMovie = await movie.save( )
    return saveMovie
  } catch (error) {
    throw error
  }
}
app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body)
    res.status(201).json({ message: "Movie added successfully.", movie:
    savedMovie })
  } catch (error) {
  res.status(500).json({ error: "Failed to add movie" })
  }
})

// get movte by director name
async function readMovieByDirector(directorName) {
  try {
  const movieByDirector = await Movie. find({ director: directorName })
  return movieByDirector
  } catch (error) {
  console. log(error)
  }
}

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName)
    if (movies.length != 0) {
      res.json(movies)
    } else {
    res.status(404).json({ error: "No movies found." })
    }
  } catch (error) {
  res.status(500).json({ error: "Failed to fetch movies." })
  }
});

async function readMovieByGenre(genreName) {
  try {
    const movieByGenre = await Movie.find({ genre: genreName })
    return movieByGenre
  } catch (error) {
    console.log(error)
  }
}

app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName)
    if (movies.length != 0) {
      res.json(movies)
    } else {
      res.status(404).json({ error: "No movies found." })
    }
  } catch (error) {
  res.status(500).json({ error: "Failed to fetch movies." })
  }
});

app.delete("/movie/delete/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//BI1.1_HW1
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/books/title/:title", async (req, res) => {
  try {
    const book = await Book.findOne({ title: req.params.title });
    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/books/author/:author", async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.author });
    if (!books) {
      return res.status(404).json({ message: "Book does not exist" });
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
