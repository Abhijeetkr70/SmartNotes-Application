import { clerkClient } from '@clerk/clerk-sdk-node';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const token = header.slice(7);
    const client = await clerkClient.clients.verifyClient(token);
    if (!client) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const session = client.sessions?.[0];
    if (!session?.userId) {
      return res.status(401).json({ success: false, message: 'No user session' });
    }

    req.userId = session.userId;
    next();
  } catch (error) {
    if (error.status === 401 || error.status === 400) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    next(error);
  }
}
