import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { validateSignup } from "../validations/userValidation.js";

const authRouter = express.Router();

// signup api
authRouter.post("/signup", async (req, res) => {
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

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Get user with only the fields we want to return
    const userResponse = await User.findById(user._id).select('firstName lastName email photoUrl about skills');

    res.status(201).json({
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

// login api
authRouter.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      // check password if it matches
      const isPasswordCorrect = await user.validatePassword(password);
      if (isPasswordCorrect) {
        const token = user.getJWTToken();
        // set the token in the cookie
        res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
        
        // Get user with only the fields we want to return
        const userResponse = await User.findById(user._id).select('firstName lastName email photoUrl about skills');

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
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// logout api
authRouter.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default authRouter;
