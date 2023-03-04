require("dotenv").config() 
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// install @ffmpeg-installer/ffmpeg and fluent-ffmpeg
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
// Mmiddleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// MongoDB URL
const dbUrl = process.env.DATABASE_URL;

// Doamin
const domain = process.env.HOST_URL

// Port
const port = process.env.PORT || 5001

// ===================================//
//      Connect TO MONGOODB           //
//====================================//
mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log('connected db')
});

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, './public/upload/videos');
    },
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}_${file.originalname}`);
    }
});

// upload video middleware
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

// Set up Mongoose schema for post
const postSchema = new mongoose.Schema({
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
// Post Model
const Post = mongoose.model('Post', postSchema);

app.post('/post', upload.single('video'), async (req, res) => {
    const videoPath = req.file.path;
    const outputPath = `./public/upload/videos/`
    const videname = videoPath.split("_")[1].split(".")[0]
    const outputDir = path.join(outputPath, `${videname}`);
    const outputName = `${videname}.m3u8`;
    const outputUrl = domain+path.join(outputDir, outputName);
    // create hls folder
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    // ffmpeg commad for convert video
    const command = ffmpeg(videoPath)
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
    .output(path.join(outputDir, outputName))
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
    })
    .on('error', (err) => {
        console.error(err);
    });
    command.run();

    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      video: {
        path: outputUrl
      }
    });
  res.status(201).send({status: 201, data: post})
});

// ===================================//
//            404 ROUTES              //
//====================================//
app.get('/', (req, res) => {
    res.send('Server is Running')
  })
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  });