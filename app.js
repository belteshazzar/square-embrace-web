import dotenv from 'dotenv'
dotenv.config()

import db from './config/database.js'
db()

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from './model/User.js'
import auth from "./middleware/auth.js"

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json({ username: user.username, token: user.token });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong')
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json({username: user.username, token: user.token });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong')
  }
});

app.get("/welcome", auth, (req, res) => {
  console.log(req.user)
  res.status(200).send("Welcome 🙌 ");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

export default app;
