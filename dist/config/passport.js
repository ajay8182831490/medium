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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const bcrypt = require('bcrypt');
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({ where: { email: username } });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.clientid,
    clientSecret: process.env.clientsecret,
    callbackURL: 'https://medium-f2ly.onrender.com/auth/google/callback'
}, (token, tokenSecret, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield prisma.user.findUnique({
            where: { googleId: profile.id }
        });
        if (!user) {
            user = yield prisma.user.create({
                data: {
                    googleId: profile.id,
                    name: profile.displayName,
                }
            });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
exports.default = passport_1.default;
