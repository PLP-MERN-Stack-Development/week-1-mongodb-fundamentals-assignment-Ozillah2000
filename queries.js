Import MongoDB client
import { MongoClient } from 'mongodb';
// Connection URI (replace with your MongoDB connection string if using Atlas)
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';
// creating a collection called books
db.books.insertMany([
  {
    title: "The London Fog",
    author: "Emily Brontë",
    genre: "Historical Fiction",
    published_year: 2005,
    price: 12.99,
    in_stock: true,
    pages: 320,
    publisher: "UK Classic Press"
  },
  {
    title: "Manchester Nights",
    author: "James Smith",
    genre: "Mystery",
    published_year: 2010,
    price: 9.5,
    in_stock: true,
    pages: 250,
    publisher: "Northern Lights Publishing"
  },
  {
    title: "Oxford Tales",
    author: "Clara Johnson",
    genre: "Drama",
    published_year: 2018,
    price: 14.0,
    in_stock: false,
    pages: 280,
    publisher: "Scholars' Print UK"
  },
  {
    title: "Scottish Whispers",
    author: "Ian McGregor",
    genre: "Thriller",
    published_year: 2022,
    price: 17.25,
    in_stock: true,
    pages: 360,
    publisher: "Highlands Press"
  },
  {
    title: "Cambridge Dreams",
    author: "Olivia Green",
    genre: "Romance",
    published_year: 2016,
    price: 10.99,
    in_stock: true,
    pages: 310,
    publisher: "UK Romance House"
  },
  {
    title: "Liverpool Shadows",
    author: "Harry Woods",
    genre: "Mystery",
    published_year: 2011,
    price: 11.5,
    in_stock: false,
    pages: 290,
    publisher: "Red River Books"
  },
  {
    title: "Yorkshire Dales",
    author: "Lucy Hall",
    genre: "Historical Fiction",
    published_year: 2014,
    price: 13.99,
    in_stock: true,
    pages: 340,
    publisher: "Countryside Books"
  },
  {
    title: "Bristol Breeze",
    author: "Mark Taylor",
    genre: "Romance",
    published_year: 2019,
    price: 12.0,
    in_stock: true,
    pages: 275,
    publisher: "CityLove UK"
  },
  {
    title: "Welsh Winds",
    author: "Sophie Bennett",
    genre: "Drama",
    published_year: 2020,
    price: 15.5,
    in_stock: true,
    pages: 295,
    publisher: "Celtic Tales Publishing"
  },
  {
    title: "The London Fog II",
    author: "Emily Brontë",
    genre: "Historical Fiction",
    published_year: 2023,
    price: 18.99,
    in_stock: true,
    pages: 370,
    publisher: "UK Classic Press"
  }
]);

//Find all books in a specific genre 
db.books.find({ genre: "Mystery" });

// Find books published after a certain year (e.g., 2015):
db.books.find({ published_year: { $gt: 2015 } });

// Find books by a specific author (e.g., "Emily Brontë"):
db.books.find({ author: "Emily Brontë" });

//Update the price of a specific book (e.g., change price of "Cambridge Dreams" to 13.49):
db.books.updateOne(
  { title: "Cambridge Dreams" },
  { $set: { price: 13.49 } }
);

//Delete a book by its title (e.g., delete "Liverpool Shadows"):

db.books.deleteOne({ title: "Liverpool Shadows" });

//Task 3: Advanced Queries
//to find books that are both in stock and published after 2010:
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

//Use projection to return only the title, author, and price fields in your queries
db.books.find(
  { genre: "Mystery" },
  { _id: 0, title: 1, author: 1, price: 1 }
);

// Sort by Price – Ascending (Low to High)

db.books.find(
  {},
  { _id: 0, title: 1, author: 1, price: 1 }
).sort({ price: 1 });


//Sort by Price – Descending (High to Low)
db.books.find(
  {},
  { _id: 0, title: 1, author: 1, price: 1 }
).sort({ price: -1 });

// Pagination Pattern (5 books per page)
db.books.find(
  {},
  { _id: 0, title: 1, author: 1, price: 1 }
)
.sort({ price: 1 })
.skip(0)
.limit(5);

//Task 4: Aggregation Pipeline
//aggregation pipeline to calculate the average price of books by genre:
db.books.aggregate([
  {
    $group: {
      _id: "$genre",                      // Group by genre
      average_price: { $avg: "$price" }  // Calculate average price
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      average_price: { $round: ["$average_price", 2] } // Round to 2 decimal places
    }
  },
  {
    $sort: { genre: 1 }  // Optional: Sort alphabetically by genre
  }
]);

// aggregation pipeline to find the author with the most books in the collection:
db.books.aggregate([
  {
    $group: {
      _id: "$author",          // Group by author
      book_count: { $sum: 1 }  // Count books per author
    }
  },
  {
    $sort: { book_count: -1 }  // Sort in descending order of book count
  },
  {
    $limit: 1                  // Return only the top author
  },
  {
    $project: {
      _id: 0,
      author: "$_id",
      book_count: 1
    }
  }
]);


//aggregation pipeline that groups books by publication decade and counts how many books were published in each decade:
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      decade: "$_id",
      count: 1
    }
  },
  {
    $sort: { decade: 1 }
  }
]);

//Task 5: Indexing
// Create an index on the 'author' field to speed up queries that filter by author
db.books.find({ title: "Cambridge Dreams" });

// Create an index on the 'published_year' field to speed up queries that filter by publication year

db.books.find({ author: "George Orwell", published_year: { $gt: 1940 } });
//Use the explain() method to demonstrate the performance improvement with your indexes
db.books.find({ title: "Cambridge Dreams" }).explain("executionStats");