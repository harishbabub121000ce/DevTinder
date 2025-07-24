import express from "express";
import User from "../models/user.js";
import userAuth from "../middleware/auth.js";
import { validateUserUpdate } from "../validations/index.js";
import bcrypt from "bcrypt";

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req,res)=> {
    try {
        const { user } = req;
        // Select only the fields we need instead of deleting password
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            gender: user.gender,
            photoUrl: user.photoUrl,
            about: user.about,
            skills: user.skills
        };
        
        res.status(200).json({
            success: true,
            user: userResponse,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // only update if it has the allowed fields
    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "password",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];


    // Validate update data
    const validation = validateUserUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    if (Object.keys(req.body).some((field) => !allowedFields.includes(field))) {
        return res.status(400).json({
          success: false,
          message: "Invalid fields",
        });
      }
    // req.user is the user who is logged in
    const { user } = req;

    // if password is provided, hash it
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    // update the user fields through the req body
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    
    // Select only the fields we need for response
    const userResponse = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        age: updatedUser.age,
        gender: updatedUser.gender,
        photoUrl: updatedUser.photoUrl,
        about: updatedUser.about,
        skills: updatedUser.skills
    };
    
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
profileRouter.delete("/user", async (req, res) => {
    try {
      const { id } = req.body;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      
      // Select only the fields we need instead of deleting password
      const userResponse = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
          gender: user.gender,
          photoUrl: user.photoUrl,
          about: user.about,
          skills: user.skills
      };
      
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

export default profileRouter;