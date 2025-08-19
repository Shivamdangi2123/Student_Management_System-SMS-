const express = require('express');
const router = express.Router();
const {
  addBook,
} = require('../controllers/bookController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Add Book
router.post(
  '/books',
  verifyToken,
  checkRole(['Librarian', 'Admin']),
  checkPermission(['add_book','manage_books']),
  addBook
);

module.exports = router;
