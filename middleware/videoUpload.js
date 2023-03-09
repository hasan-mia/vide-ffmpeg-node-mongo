/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// Doamin
const domain = process.env.HOST_URL

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/upload/videos');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  },
  fileFilter: (req, file, callback) => {
    const filetypes = /mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return callback(null, true);
    } else {
      callback('Error: Only MP4 files are allowed.');
    }
  }});

function videoUpload(req, res, next) {
  upload.single('video')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: 'File upload error: ' + err.message
      });
    } else if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
    const uploadPath = req.file.path;
    const videoPath = `./public/upload/videos/`
    const videoname = uploadPath.split("_")[1].split(".")[0]
    const videoDir = path.join(videoPath, `${videoname}`);
    const outputName = Date.now() + `${videname}.m3u8`;
    const outputUrl = domain+path.join(videoDir, outputName);

      // create hls folder
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir);
      }
    // create thumbnail from video
    // req.file.thumbnail = path.join('thumbnails', Date.now() + `${videname}.png`);
    // ffmpeg commad for convert video
    const command = ffmpeg(uploadPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
          '-c:v libx264',
          '-preset slow',
          '-crf 28',
          '-c:a aac',
          '-b:a 128k',
          '-hls_segment_type fmp4',
          '-hls_time 10',
          '-hls_list_size 0'
      ])
      .output(path.join(videoDir, outputName))
      .on('end', () => {
          console.log('Conversion complete!');
          // remove orginal file
          fs.unlink(videoPath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Original file removed')
          });
          next();
      })
      .on('error', (err) => {
          console.error(err);
      });
      command.run();
      // console.log(outputUrl)

  });
}

module.exports = videoUpload