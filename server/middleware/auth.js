import { clerkClient } from '@clerk/clerk-sdk-node';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const token = header.slice(7);
    const payload = await clerkClient.verifyToken(token);

    if (!payload?.sub) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    req.userId = payload.sub;
    next();
  } catch (error) {
    if (error.status === 401 || error.status === 400 || error.name === 'TokenVerificationError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    next(error);
  }
}
