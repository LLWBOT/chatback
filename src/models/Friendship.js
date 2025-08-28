const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('friendships', FriendshipSchema);
