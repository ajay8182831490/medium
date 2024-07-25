import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    userId?: number;
}

const attachUserId = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user) {

        console.log(req.user)
        req.userId = (req.user as any).id;
        return next();
    }
    res.status(401).send('Unauthorized');
};

export default attachUserId;