const client = require('../config/db');
const jwt = require('jsonwebtoken');    



const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

console.log("Received token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT_SECRET = ", decoded);

        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        const userId = req.user.user_id;

        try {
           const result = await client.query(`
  SELECT r.role_name 
  FROM UserRoles ur
  JOIN Roles r ON ur.role_id = r.role_id
  WHERE ur.user_id = $1`, 
  [userId]
);

const userRoles = result.rows.map(r => r.role_name);

            const isAllowed = allowedRoles.some(role => userRoles.includes(role));

            if (!isAllowed) {
                return res.status(403).json({ message: 'Access denied: Insufficient role' });
            }

            next();
        } catch (err) {
            console.error('Role check error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    const userPerms = req.user.permissions || [];

    const hasPermission = requiredPermissions.some(perm =>
      userPerms.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied: Insufficient permission' });
    }

    next();
  };
};


const checkInstitutionMatch = async (req, res, next) => {
  const { user_id } = req.body;
  const adminInstitutionId = req.user.institution_id;

  const result = await client.query(
    'SELECT institution_id FROM users WHERE user_id = $1',
    [user_id]
  );

  if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

  if (result.rows[0].institution_id !== adminInstitutionId) {
    return res.status(403).json({ message: 'Access denied: Institution mismatch' });
  }

  next();
};



module.exports = {
    verifyToken,
    checkRole,
        checkPermission,
        checkInstitutionMatch,
};


