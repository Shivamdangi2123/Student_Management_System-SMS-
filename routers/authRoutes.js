const express = require('express');
const router = express.Router();
const {
    login,
    register,
} = require('../controllers/authController');
const {
  // verifyToken,
  //checkRole,
  // checkPermission
} = require('../middlewares/authMiddleware');

router.post(
  '/register',
  // verifyToken,
  // checkRole(['Admin', 'Manager']),
  // checkPermission(['create_user']),
  register
);
router.post('/login',login);

module.exports = router;
