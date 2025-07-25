import express from "express";
import userAuth from "../middleware/auth.js";
import User from "../models/user.js";
import Connection from "../models/connection.js";

const feedRouter = express.Router();

// get all users route
feedRouter.get("/feed", userAuth, async (req, res) => {
    try {
      const currentUserId = req.user._id;
      
      // Find all connections where current user is involved (as fromUser or toUser)
      const existingConnections = await Connection.find({
        $or: [
          { fromUser: currentUserId },
          { toUser: currentUserId }
        ]
      });
      
      // Extract user IDs that are already connected
      const connectedUserIds = existingConnections.map(connection => {
        return connection.fromUser.toString() === currentUserId.toString() 
          ? connection.toUser 
          : connection.fromUser;
      });
      
      // Add current user to excluded list
      const excludedUserIds = [...connectedUserIds, currentUserId];
      
      // Find users excluding current user and already connected users, and exclude password
      const users = await User.find({ 
        _id: { $nin: excludedUserIds } 
      }).select("-password");
      
      res.status(200).json({
        success: true,
        users: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

export default feedRouter;