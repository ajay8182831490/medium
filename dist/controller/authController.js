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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const hashPassword_1 = require("../utils/hashPassword");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { email: email }
        });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        yield prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });
        res.send('User registered successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});
exports.registerUser = registerUser;
