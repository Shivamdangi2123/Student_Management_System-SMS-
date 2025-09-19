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
const updateInstitution = async (req, res) => {
  const {
    institution_id,
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
    // ✅ Only allow update if this user is linked to same institution
    const userCheck = await client.query(
      `SELECT institution_id FROM users WHERE user_id = $1`,
      [userId]
    );

    if (userCheck.rows.length === 0 || userCheck.rows[0].institution_id !== institution_id) {
      return res.status(403).json({ message: 'You are not authorized to update this institution' });
    }

    await client.query(
      `UPDATE institutions SET 
        institution_name = $1, address_line1 = $2, address_line2 = $3,
        city = $4, state = $5, pincode = $6, contact_phone = $7, contact_email = $8,
        website = $9, logo_url = $10, affiliation_board = $11, udise_code = $12,
        gstin = $13, pan = $14, established_date = $15
      WHERE institution_id = $16`,
      [
        institution_name, address_line1, address_line2,
        city, state, pincode, contact_phone, contact_email,
        website, logo_url, affiliation_board, udise_code,
        gstin, pan, established_date, institution_id
      ]
    );

    res.status(200).json({ message: 'Institution updated successfully' });
  } catch (err) {
    console.error('Institution update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createInstitution,
  updateInstitution
};


