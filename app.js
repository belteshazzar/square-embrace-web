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
      // bad request
      res.status(400).send("All input is required")
      return
    }

    // check if user already exist
    // Validate if user exist in our database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // conflict
      res.status(409).send("User Already Exist. Please Login");
      return
    }

    // Create user in our database
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });

    // return new user
    // created
    res.status(201).json({ username: user.username });
  } catch (err) {
    console.log(err);
    // server error
    res.status(500).send('oops, something went wrong')
  }
});

// accessTokens
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
}

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      // bad request
      res.status(400).send("All input is required");
      return
    }

    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (!user) {
      // BAD REQUEST
      res.status(400).send("invalid credentials");
      return
    }

    if (!( await bcrypt.compare(password, user.password))) {
      // BAD REQUEST
      res.status(400).send("invalid credentials");
      return
    }

    const accessToken = generateAccessToken ({username: username, access: 'read write'})
    const refreshToken = generateRefreshToken ({username: username})

    res.status(200).json({username: user.username, accessToken: accessToken, refreshToken: refreshToken });

  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong')
  }
});

app.post("/refresh", (req,res) => {

    // virtually the same case as in auth.js
    // and allows indefinate refresh

    let token

    if (req.headers['authorization']) {
      let ss = req.headers['authorization'].split(' ')
      if (ss.length==2 && ss[0]=='Bearer') {
        token = ss[1]
      }
    } else {
      token = req.body.token || req.query.token;
    }
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
  
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken ({username: decoded.username, acces: decoded.access})
      const refreshToken = generateRefreshToken ({username: decoded.username})
      res.json ({accessToken: accessToken, refreshToken: refreshToken})
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
})

app.delete("/logout", (req,res)=>{
  // TODO: invalidate refresh token
  res.status(204).send("Logged out!")
})

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
