import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,

    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    profilePic: {
        type: String,
    },
    coverPic: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});



export default mongoose.models.User || model("User", userSchema);

