const jwt = require('jsonwebtoken'); // already required hona chahiye
  const client = require('../config/db');
const createInstitution = async (req, res) => {
  const {
    institution_name,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    contact_phone,
    contact_email,
    website,
    logo_url,
    affiliation_board,
    udise_code,
    gstin,
    pan,
    established_date
  } = req.body;

  // ✅ Extract user ID from JWT token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.user_id;
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  try {
    // ✅ Step 1: Create institution
    const result = await client.query(
      `INSERT INTO institutions (
        institution_name, address_line1, address_line2,
        city, state, pincode, contact_phone, contact_email,
        website, logo_url, affiliation_board, udise_code,
        gstin, pan, established_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15
      ) RETURNING institution_id`,
      [
        institution_name, address_line1, address_line2,
        city, state, pincode, contact_phone, contact_email,
        website, logo_url, affiliation_board, udise_code,
        gstin, pan, established_date
      ]
    );

    const institutionId = result.rows[0].institution_id;

    // ✅ Step 2: Update user's institution_id
    await client.query(
      `UPDATE users SET institution_id = $1 WHERE user_id = $2`,
      [institutionId, userId]
    );
  // ✅ Create new token after assigning institution
const newPayload = {
  user_id: userId,
  institution_id: institutionId
};
const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

res.status(201).json({
  message: 'Institution created and linked to user successfully',
  institution_id: institutionId,
  token: newToken // ⬅️ return updated token
});
} catch (err) {
    console.error('Institution creation error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  createInstitution
};
