const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    title: String,
    description: String,
    video: {
      path: String,
      mimetype: String,
      size: Number
    },
    view:{
      type: Number,
      default: 0
    }
  });
  // Video Model
  const Video = mongoose.model('Video', VideoSchema);

  module.exports = Video;