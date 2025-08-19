const express = require('express');
const router = express.Router();

const { createInstitution } = require('../controllers/institutionController');
const { verifyToken, checkRole, checkPermission } = require('../middlewares/authMiddleware');

// Only Admin with 'create_institution' permission can create institution
router.post(
  '/create/institution',
  verifyToken,
  checkRole(['Admin']),
  checkPermission(['create_institution']),
  createInstitution
);

module.exports = router;
