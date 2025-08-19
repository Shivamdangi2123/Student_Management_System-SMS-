const client = require('../config/db');

// ➕ Add a New Book
const addBook = async (req, res) => {
  const {
    isbn,
    title,
    author,
    publisher,
    publication_year,
    edition,
    genre,
    total_copies,
    available_copies,
    shelf_location,
    barcode
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO Books (
        isbn, title, author, publisher, publication_year, edition,
        genre, total_copies, available_copies, shelf_location, barcode
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      ) RETURNING *`,
      [
        isbn,
        title,
        author,
        publisher,
        publication_year,
        edition,
        genre,
        total_copies,
        available_copies,
        shelf_location,
        barcode
      ]
    );

    res.status(201).json({
      message: 'Book added successfully',
      book: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📚 Get All Books
const getAllBooks = async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM Books ORDER BY title ASC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  addBook,
 
};
