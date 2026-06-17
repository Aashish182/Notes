
const Note = require("../models/Note");

const getAllNotes = async (req, res) => {
  try {
    const { search, tag } = req.query;
    let filter = { user: req.user._id };

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (tag && tag.trim()) {
      filter.tags = tag.trim();
    }

    const notes = await Note.find(filter).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      error: error.message,
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, tags, color } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: content ? content.trim() : "",
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
      color: color || "default",
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create note",
      error: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (tags !== undefined)
      updateData.tags = Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter(Boolean)
        : [];
    if (color !== undefined) updateData.color = color;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid note ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid note ID format" });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

const togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${note.isPinned ? "pinned" : "unpinned"}`,
      data: note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle pin", error: error.message });
  }
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote, togglePin };