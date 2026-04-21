const Task = require('../models/Task');
const Idea = require('../models/Idea');
const { isTeamMember } = require('../middleware/authMiddleware');

const getTasks = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (!isTeamMember(idea, req.user._id)) {
      return res.status(403).json({ message: 'Only team members can view tasks' });
    }

    const tasks = await Task.find({ idea: req.params.ideaId })
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can create tasks' });
    }

    const { title, description, assignedTo, deadline } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      idea: req.params.ideaId,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      deadline: deadline || null,
    });
    const populated = await task.populate('assignedTo', 'name email avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const idea = await Idea.findById(task.idea);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (!isTeamMember(idea, req.user._id)) {
      return res.status(403).json({ message: 'Only team members can update tasks' });
    }

    const { status, title, description, assignedTo, deadline } = req.body;
    if (status) task.status = status;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (deadline !== undefined) task.deadline = deadline || null;

    await task.save();
    const populated = await task.populate('assignedTo', 'name email avatar');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const idea = await Idea.findById(task.idea);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
