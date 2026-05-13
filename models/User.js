import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    username: {
        type: String,
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
    },
});



export default Mongoose.models.User || User;