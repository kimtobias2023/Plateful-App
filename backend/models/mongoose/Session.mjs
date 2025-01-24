import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.String, // Match Sequelize's `id` type
    required: true,
    index: true, // Index for faster lookups
  },
  loginToken: {
    type: String,
    required: true,
    unique: true,
  },
  loginTokenExpires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Optional: Auto-remove expired sessions after 7 days
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
