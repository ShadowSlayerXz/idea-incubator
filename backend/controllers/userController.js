const User = require('../models/User');
const Idea = require('../models/Idea');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -savedIdeas');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ideas = await Idea.find({ author: req.params.id })
      .select('title category tags status interestedUsers createdAt')
      .sort({ createdAt: -1 });

    res.json({ user, ideas });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, bio, department, avatar } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (department !== undefined) user.department = department;
    if (avatar !== undefined) user.avatar = avatar;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      bio: updated.bio,
      department: updated.department,
      avatar: updated.avatar,
    });
  } catch (error) {
    next(error);
  }
};

const saveIdea = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ideaId = req.params.ideaId;
    if (user.savedIdeas.includes(ideaId)) {
      return res.status(400).json({ message: 'Idea already saved' });
    }

    user.savedIdeas.push(ideaId);
    await user.save();
    res.json({ savedIdeas: user.savedIdeas });
  } catch (error) {
    next(error);
  }
};

const unsaveIdea = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedIdeas = user.savedIdeas.filter(
      (id) => id.toString() !== req.params.ideaId
    );
    await user.save();
    res.json({ savedIdeas: user.savedIdeas });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, saveIdea, unsaveIdea };
