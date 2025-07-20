import express from "express";
import userAuth from "../middleware/auth.js";
import User from "../models/user.js";

const feedRouter = express.Router();

// get all users route
feedRouter.get("/feed", userAuth, async (req, res) => {
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

export default feedRouter;