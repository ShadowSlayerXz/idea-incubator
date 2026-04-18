const Idea = require('../models/Idea');

const createIdea = async (req, res, next) => {
  try {
    const { title, description, category, tags } = req.body;

    const idea = await Idea.create({
      title,
      description,
      category,
      tags: tags || [],
      author: req.user._id,
    });

    const populated = await idea.populate('author', 'name email avatar department');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getAllIdeas = async (req, res, next) => {
  try {
    const { category, search, tags, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim()) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Idea.countDocuments(filter);
    const ideas = await Idea.find(filter)
      .populate('author', 'name email avatar department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ ideas, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

const getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('author', 'name email avatar department')
      .populate('interestedUsers', 'name email avatar');

    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    res.json(idea);
  } catch (error) {
    next(error);
  }
};

const updateIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this idea' });
    }

    const { title, description, category, tags, status } = req.body;
    if (title) idea.title = title;
    if (description) idea.description = description;
    if (category) idea.category = category;
    if (tags) idea.tags = tags;
    if (status) idea.status = status;

    const updated = await idea.save();
    await updated.populate('author', 'name email avatar department');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this idea' });
    }

    await idea.deleteOne();
    res.json({ message: 'Idea removed' });
  } catch (error) {
    next(error);
  }
};

const expressInterest = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const userId = req.user._id;
    const alreadyInterested = idea.interestedUsers.includes(userId);

    if (alreadyInterested) {
      idea.interestedUsers = idea.interestedUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      idea.interestedUsers.push(userId);
    }

    await idea.save();
    res.json({
      interestedUsers: idea.interestedUsers,
      interested: !alreadyInterested,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createIdea, getAllIdeas, getIdeaById, updateIdea, deleteIdea, expressInterest };
