const videoController = require("../controllers/videoController");
const uploadVideo = require("../middleware/uploadVideo");
const router = require("express").Router()

/**
  * @api {post} /published a video post
  * @apiDescription save post of user
  * @apiPermission anyone
 */
router.route("/").post(uploadVideo.single('video'), videoController.postViedeo)

module.exports= router;