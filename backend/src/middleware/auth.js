import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No authentication token, access denied');
    }

    // TODO: Verify token with JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default auth;