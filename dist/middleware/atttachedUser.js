"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachUserId = (req, res, next) => {
    if (req.isAuthenticated() && req.user) {
        req.userId = req.user.id;
        return next();
    }
    res.status(401).send('Unauthorized');
};
exports.default = attachUserId;
