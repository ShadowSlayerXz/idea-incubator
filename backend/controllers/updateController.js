const Update = require('../models/Update');
const Idea = require('../models/Idea');
const { isTeamMember } = require('../middleware/authMiddleware');

const getUpdates = async (req, res, next) => {
  try {
    const updates = await Update.find({ idea: req.params.ideaId })
      .populate('author', 'name email avatar role')
      .sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    next(error);
  }
};

const addUpdate = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const isMentor = req.user.role === 'mentor';
    const canPost = isTeamMember(idea, req.user._id) || isMentor;
    if (!canPost) return res.status(403).json({ message: 'Not authorized to post updates' });

    const update = await Update.create({
      idea: req.params.ideaId,
      author: req.user._id,
      message,
      type: isMentor ? 'feedback' : 'update',
    });
    const populated = await update.populate('author', 'name email avatar role');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const deleteUpdate = async (req, res, next) => {
  try {
    const update = await Update.findById(req.params.updateId);
    if (!update) return res.status(404).json({ message: 'Update not found' });

    const isAuthor = update.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAuthor && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await update.deleteOne();
    res.json({ message: 'Update removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUpdates, addUpdate, deleteUpdate };
