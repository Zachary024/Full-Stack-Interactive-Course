const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}

const sign = (user) =>
  jwt.sign({ sub: String(user.id), role: user.role }, SECRET, { expiresIn: '7d' });

// Verifies the Bearer token; optional roles => RBAC
const required = (...roles) => (req, res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    const c = jwt.verify(h.slice(7), SECRET);
    req.user = { id: Number(c.sub), role: c.role };
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  if (roles.length && !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

module.exports = { sign, required };
