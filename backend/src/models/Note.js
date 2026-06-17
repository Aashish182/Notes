const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "default",
      enum: ["default", "red", "orange", "yellow", "green", "blue", "purple"],
    },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// Text index for efficient full-text search on title and content
noteSchema.index({ title: "text", content: "text" });
// Speeds up the common "this user's notes, newest first" query
noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });

module.exports = mongoose.model("Note", noteSchema);