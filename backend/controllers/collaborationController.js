const CollaborationRequest = require('../models/CollaborationRequest');
const Idea = require('../models/Idea');

const submitRequest = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const uid = req.user._id.toString();
    if (idea.author.toString() === uid) {
      return res.status(400).json({ message: 'You are the owner of this idea' });
    }
    if (idea.collaborators.some((c) => c.toString() === uid)) {
      return res.status(400).json({ message: 'You are already a team member' });
    }

    const existing = await CollaborationRequest.findOne({
      idea: req.params.ideaId,
      requester: req.user._id,
      status: 'pending',
    });
    if (existing) return res.status(400).json({ message: 'You already have a pending request' });

    const request = await CollaborationRequest.create({
      idea: req.params.ideaId,
      requester: req.user._id,
      message: req.body.message || '',
    });
    const populated = await request.populate('requester', 'name email avatar role');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can view requests' });
    }

    const requests = await CollaborationRequest.find({ idea: req.params.ideaId })
      .populate('requester', 'name email avatar role')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const respondToRequest = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can respond to requests' });
    }

    const request = await CollaborationRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    request.status = status;
    await request.save();

    if (status === 'approved') {
      const alreadyMember = idea.collaborators.some(
        (c) => c.toString() === request.requester.toString()
      );
      if (!alreadyMember) {
        idea.collaborators.push(request.requester);
        await idea.save();
      }
    }

    const populated = await request.populate('requester', 'name email avatar role');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await CollaborationRequest.find({ requester: req.user._id })
      .populate('idea', 'title status')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRequest, getRequests, respondToRequest, getMyRequests };
