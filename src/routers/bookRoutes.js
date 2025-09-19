const express = require('express');
const router = express.Router();
const {
  addBook,getAllBooks
} = require('../controllers/bookController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Add Book
router.post(
  '/books',
  verifyToken,
  checkRole(['Librarian', 'Admin']),
  // checkPermission(['add_book','manage_books']),
  addBook
);
router.get("/books",verifyToken,getAllBooks)
module.exports = router;
