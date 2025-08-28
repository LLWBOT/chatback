const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');

// @route   POST /api/add-friend
router.post('/add-friend', async (req, res) => {
  const { uniqueId } = req.body;
  if (!uniqueId) {
    return res.status(400).json({ message: 'Please enter a valid ID' });
  }

  try {
    const friend = await User.findOne({ uniqueId });
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: req.userId, user2: friend._id },
        { user1: friend._id, user2: req.userId }
      ]
    });
    if (existingFriendship) {
      return res.status(400).json({ message: 'You are already friends' });
    }

    const newFriendship = new Friendship({
      user1: req.userId,
      user2: friend._id
    });
    await newFriendship.save();

    // Send initial "Hi" message
    const initialMessage = new Message({
      senderId: req.userId,
      receiverId: friend._id,
      text: 'Hi'
    });
    await initialMessage.save();

    res.status(201).json({ message: 'Friend added successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/friends
router.get('/friends', async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ user1: req.userId }, { user2: req.userId }]
    }).populate('user1').populate('user2');

    const friendsList = friendships.map(friendship => {
      const friend = friendship.user1._id.toString() === req.userId ? friendship.user2 : friendship.user1;
      return {
        id: friend._id,
        username: friend.username,
        profilePicture: friend.profilePicture
      };
    });

    res.json(friendsList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
