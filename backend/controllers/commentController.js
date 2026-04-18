const Comment = require('../models/Comment');
const Idea = require('../models/Idea');

const addComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const comment = await Comment.create({
      idea: req.params.ideaId,
      author: req.user._id,
      text: req.body.text,
    });

    const populated = await comment.populate('author', 'name email avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getCommentsByIdea = async (req, res, next) => {
  try {
    const comments = await Comment.find({ idea: req.params.ideaId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getCommentsByIdea, deleteComment };
