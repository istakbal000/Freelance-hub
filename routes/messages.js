const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { receiver, message } = req.body;

    const messageData = {
      sender: req.user.id,
      receiver,
      message
    };

    const newMessage = await Message.create(messageData);
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/conversations/list', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    const conversations = {};
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
      const otherUserId = otherUser._id.toString();
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      
      if (msg.receiver._id.toString() === req.user.id && !msg.read) {
        conversations[otherUserId].unreadCount++;
      }
    });

    res.status(200).json({
      success: true,
      data: Object.values(conversations)
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
