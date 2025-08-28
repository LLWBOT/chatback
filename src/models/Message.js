const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('messages', MessageSchema);
