const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Video = require("../models/Video")

// Doamin
const domain = process.env.HOST_URL

const postViedeo = async (req, res) => {
    const videoPath = req.file.path;
    const outputPath = `public/upload/videos`
    const videname = videoPath.split("_")[1].split(".")[0]
    const outputDir = path.join(outputPath, Date.now() + `${videname}`);
    const outputName = Date.now() + `${videname}.m3u8`;
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

    // Create video post object for mongodb
    const videoPost = new Video({
      title: req.body.title,
      description: req.body.description,
      video: {
        path: outputUrl
      }
    });
    try {
        const saveVideoPost = await videoPost.save();
        res.status(200).send({status: 200, success: true, message: "post publish successfully", data: saveVideoPost})
    } catch (error) {
       return res.status(500).send(error); 
    }    
}

module.exports = {postViedeo}