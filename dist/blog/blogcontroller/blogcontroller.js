"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authmiddleware = require('../../middleware/authMiddleware');
const prisma = new client_1.PrismaClient();
const atttachedUser_1 = __importDefault(require("../../middleware/atttachedUser"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
// create delete read all update sorting pagination
const express = require('express');
const router = express.Router();
// router.get('/createPost', ensureAuthenticated, attachUserId, (req: Request, res: Response) => {
//     res.json("hello");
// })
router.get('/createPost', authMiddleware_1.ensureAuthenticated, atttachedUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { title, content } = req.body;
    yield prisma.post.create({
        data: {
            authorid: userId,
            title,
            content
        }
    });
    res.redirect('/');
    res.json({ message: "blod created succeesfully" });
}));
router.put('/update/:id', authMiddleware_1.ensureAuthenticated, atttachedUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    // we will check the author should be same of the post author
    const { title, content } = req.body;
    const post = yield prisma.post.findUnique({
        where: {
            id: id
        }
    });
    if (!post) {
        res.status(401).json("post not found");
    }
    if ((post === null || post === void 0 ? void 0 : post.authorid) != userId) {
        return res.status(403).json("you are not authorize");
    }
    yield prisma.post.update({
        where: { id: id },
        data: {
            title,
            content
        }
    });
    res.status(200).json("post updated successfully");
}));
router.get('/post', authMiddleware_1.ensureAuthenticated, atttachedUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    // we will check the author should be same of the post author
    const post = yield prisma.post.findMany({
        where: {
            authorid: parseInt(userId)
        }
    });
    res.status(200).json(post);
}));
router.delete('/delete/:id', authMiddleware_1.ensureAuthenticated, atttachedUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    // we will check the author should be same of the post author
    const { title, content } = req.body;
    const post = yield prisma.post.findUnique({
        where: {
            id: id
        }
    });
    if (!post) {
        res.status(401).json("post not found");
    }
    if ((post === null || post === void 0 ? void 0 : post.authorid) != userId) {
        return res.status(403).json("you are not authorize");
    }
    yield prisma.post.delete({
        where: { id: id }
    });
    res.status(200).json("post deleted successfully");
}));
//sorting pagination searching
router.post('/pagePost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGE LIMIT
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.order === 'asc' ? 'asc' : 'dsc';
    const content = req.query.content || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const skip = (page - 1) * limit;
    const post = yield prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: content, mode: 'insensitive' } },
                { content: { contains: content, mode: 'insensitive' } },
                { author: { name: { contains: content, mode: 'insensitive' } } }
            ],
        },
        orderBy: {
            [sortBy]: sort,
        },
        skip: skip,
        take: limit,
    });
    const totalPosts = yield prisma.post.count({
        where: {
            OR: [
                { title: { contains: content, mode: 'insensitive' } },
                { content: { contains: content, mode: 'insensitive' } },
                { author: { name: { contains: content, mode: 'insensitive' } } }
            ],
        },
    });
    res.status(200).json({
        post,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
    });
}));
exports.default = router;
