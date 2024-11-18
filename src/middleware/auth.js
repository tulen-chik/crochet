import { verifyToken } from '@/lib/jwt';

export function authMiddleware(handler) {
    return async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        return handler(req, res);
    };
}