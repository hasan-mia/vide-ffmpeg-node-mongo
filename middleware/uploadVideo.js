const multer = require('multer');

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/upload/videos');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  }
});

// upload video middleware
const uploadVideo = multer({  storage: storage});

// const uploadVideo = multer({  storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 50 // 50MB
//     },
//     fileFilter: (req, file, callback) => {
//       const filetypes = /mp4/;
//       const mimetype = filetypes.test(file.mimetype);
//       const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
//       if (mimetype && extname) {
//         return callback(null, true);
//       } else {
//         callback('Error: Only MP4 files are allowed.');
//       }
//     }});

module.exports = uploadVideo;