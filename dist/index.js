"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session = require('express-session');
const passport_1 = __importDefault(require("./config/passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const blogcontroller_1 = __importDefault(require("./blog/blogcontroller/blogcontroller"));
const port = process.env.port || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(authRoutes_1.default);
app.use(blogcontroller_1.default);
app.listen(port, () => {
    console.log("server is running on port no 3000");
});
