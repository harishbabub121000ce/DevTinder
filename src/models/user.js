import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        max: 20,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png",
    },
    about: {
        type: String,
        default: "Hey! Send me a connection request if you want to connect with me",
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

// Add methods to the schema before creating the model
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id}, "Hacker@123", {expiresIn: "1d"});
}

/*
    @param {string} password - The password entered by the user
    this.password is the hashed password stored in the database
*/
userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;