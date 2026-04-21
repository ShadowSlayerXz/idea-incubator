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

    const { name, bio, department, avatar, skills, interests } = req.body;
    if (name !== undefined && name.trim().length > 0) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (department !== undefined) user.department = department;
    if (avatar !== undefined) user.avatar = avatar;
    if (skills !== undefined) {
      if (!Array.isArray(skills)) return res.status(400).json({ message: 'Skills must be an array' });
      user.skills = skills;
    }
    if (interests !== undefined) {
      if (!Array.isArray(interests)) return res.status(400).json({ message: 'Interests must be an array' });
      user.interests = interests;
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      bio: updated.bio,
      department: updated.department,
      avatar: updated.avatar,
      role: updated.role,
      skills: updated.skills,
      interests: updated.interests,
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
