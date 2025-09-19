const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  updateBorrowStatus,
  getAllBorrowed
} = require('../controllers/borrowController');

const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// ➕ Issue a Book
router.post(
  '/borrowbooks',
  verifyToken,
  checkRole(['Admin','Librarian']),
  // checkPermission(['issue_book']),
  issueBook
);

// ✅ Return a Book
router.put(
  '/return/:borrow_id',
  verifyToken,
  checkRole(['Librarian', 'Admin']),
  // checkPermission(['return_book','manage_borrowing']),
  returnBook
);

// 🔄 Update Fine / Borrow Status
router.put(
  '/update/:borrow_id',
  verifyToken,
  checkRole(['Librarian', 'Admin']),
  // checkPermission(['update_borrow_status']),
  updateBorrowStatus
);

// 📚 Get All Borrowed Books
router.get(
  '/borrowed',
  verifyToken,
  // checkPermission(['view_borrowed_books']),
  getAllBorrowed
);

module.exports = router;
