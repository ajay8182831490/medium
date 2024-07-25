import express from 'express';
const session = require('express-session');
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import blogcontroller from './blog/blogcontroller/blogcontroller'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SECRET_SESSION_KEY!,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use(blogcontroller)
app.listen(3000, () => {
  console.log("server is running on port no 3000")
})


