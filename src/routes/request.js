import express from "express";
import userAuth from "../middleware/auth.js";
import User from "../models/user.js";
import Connection from "../models/connection.js";   

const requestRouter = express.Router();

// this api handles only like and pass a connection suggestion
requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    console.log("requestRouter");
    const fromUser = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    // validate toUser is a valid user
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "Can't send request to this user",
      });
    }
    // validate fromUser is  not the same as toUser
    if (fromUser.toString() === toUser.toString()) {
      return res.status(400).json({
        success: false,
        message: "You can't send request to yourself",
      });
    }
    if (status === "interested" || status === "ignored") {
        // check if the connection already exists
        const existingConnection = await Connection.findOne({
            fromUser,
            toUser: toUserId,
        });
        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: "You already have a connection request or ignored this user",
            });
        }
      // Create the connection
      const connection = await Connection.create({
        fromUser,
        toUser: toUserId,
        status,
      });
      
      // Populate the references directly on the connection object
      await connection.populate('toUser', 'firstName lastName email photoUrl about skills');

      return res.status(201).json({
        success: true,
        data: connection,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

requestRouter.post("/request/review/:status/:fromUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.params.fromUserId;
        const status = req.params.status;
        const currentUser = req.user._id;
        const fromUser = await User.findById(fromUserId);
        // check if the fromUser is a valid user
        if (!fromUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (currentUser.toString() === fromUser.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't review your own request",
            });
        }
        // check if the status is valid
        if (status === "accepted" || status === "rejected") {
            const connection = await Connection.findOneAndUpdate({
                fromUser: fromUserId,
                toUser: currentUser,
            }, {
                status 
            }, {
                new: true,
                select: 'fromUser toUser status',
            });
            await connection.populate('toUser', 'firstName lastName email photoUrl about skills');
            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: connection,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default requestRouter;
