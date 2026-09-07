"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
// Middleware to check if user is logged in
const protect = (req, res, next) => {
    let token;
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        return;
    }
    // Verify token
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        return;
    }
    // Attach user to request object
    req.user = decoded;
    next();
};
exports.protect = protect;
// Middleware to check if user is an Admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};
exports.admin = admin;
//# sourceMappingURL=auth.middleware.js.map