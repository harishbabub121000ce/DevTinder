import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["interested", "ignored", "accepted", "rejected"],
    },
}, { timestamps: true });

// Pre-save validation hook
connectionSchema.pre('save', async function(next) {
    try {
        // Validate that fromUser and toUser are different
        if (this.fromUser.toString() === this.toUser.toString()) {
            throw new Error('Cannot send connection request to yourself');
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Index for better query performance
// this is a compound index, so that we can query for a connection between two users
connectionSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;