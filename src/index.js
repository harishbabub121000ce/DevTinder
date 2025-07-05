import express from "express";
import connectDB from "./config/database.js";
import User from "./models/user.js";
import { validateSignup, validateUserUpdate } from "./validations/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userAuth from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

//create routes

// signup route
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate signup data
    const validation = validateSignup(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    
    // Remove password from response for security
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/login', async (req,res)=> {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(user) {
            // check password if it matches
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(isPasswordCorrect) {
                // generate a token
                // const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
                const token = jwt.sign({id: user._id}, "Hacker@123", {expiresIn: "1d"});
                // set the token in the cookie
                res.cookie("token", token, {maxAge: 24 * 60 * 60 * 1000});
                // Remove password from response for security
                const userResponse = user.toObject();
                delete userResponse.password;
                
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    user: userResponse,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Invalid password",
                });
            }
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// profile route (protected route)
app.get('/profile', userAuth, async (req,res)=> {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }
        // Remove password from response for security
        const userResponse = req.user.toObject();
        delete userResponse.password;
        
        res.status(200).json({
            success: true,
            user: userResponse,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// get all users route
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    
    // Remove passwords from all users for security
    const usersResponse = users.map(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });
    
    res.status(200).json({
      success: true,
      users: usersResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update user
app.patch("/update/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    // only update if it has the allowed fields
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    if (Object.keys(req.body).some((field) => !allowedFields.includes(field))) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields",
      });
    }
    // Validate update data
    const validation = validateUserUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }
    // if password is provided, hash it
    const user = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Remove password from response for security
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// delete user
app.delete("/user", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Remove password from response for security
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server successfully running on port 7777");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });
