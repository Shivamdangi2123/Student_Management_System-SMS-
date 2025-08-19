const client = require('../config/db');

// ➕ Issue a Book
const issueBook = async (req, res) => {
  const {
    book_id,
    borrower_type,
    borrower_id,
    due_date,
    status = 'Borrowed'
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO BorrowedBooks (
        book_id, borrower_type, borrower_id, due_date, status
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [book_id, borrower_type, borrower_id, due_date, status]
    );

    // Update available_copies
    await client.query(
      `UPDATE Books SET available_copies = available_copies - 1 WHERE book_id = $1`,
      [book_id]
    );

    res.status(201).json({
      message: 'Book issued successfully',
      borrow: result.rows[0]
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Return a Book
const returnBook = async (req, res) => {
  const { borrow_id } = req.params;

  try {
    const returnDate = new Date();

    // Update return details
    const result = await client.query(
      `UPDATE BorrowedBooks SET 
        return_date = $1, 
        status = 'Returned' 
      WHERE borrow_id = $2 
      RETURNING *`,
      [returnDate, borrow_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    const bookId = result.rows[0].book_id;

    // Update book stock
    await client.query(
      `UPDATE Books SET available_copies = available_copies + 1 WHERE book_id = $1`,
      [bookId]
    );

    res.json({ message: 'Book returned successfully', borrow: result.rows[0] });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔄 Update Fine or Status
const updateBorrowStatus = async (req, res) => {
  const { borrow_id } = req.params;
  const { fine_amount, status } = req.body;

  try {
    const result = await client.query(
      `UPDATE BorrowedBooks SET fine_amount = $1, status = $2 WHERE borrow_id = $3 RETURNING *`,
      [fine_amount, status, borrow_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    res.json({ message: 'Borrow record updated', borrow: result.rows[0] });
  } catch (error) {
    console.error('Error updating borrow:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📚 Get All Borrowed Books
const getAllBorrowed = async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM BorrowedBooks ORDER BY borrow_date DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  issueBook,
  returnBook,
  updateBorrowStatus,
  getAllBorrowed
};
