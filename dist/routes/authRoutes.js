"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const authController_1 = require("../controller/authController");
const router = express_1.default.Router();
router.get('/login', (req, res) => {
    res.send('<form action="/login" method="post"><input type="text" name="name" /><input type="email" name="email" /><input type="password" name="password" /><button type="submit">Login</button></form>');
});
router.post('/login', passport_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});
router.post('/register', authController_1.registerUser);
router.get('/logout', authController_1.logoutUser);
exports.default = router;
