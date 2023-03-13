const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const upload = require('../../middlewares/upload')
const { Unauthorized } = require('http-errors')
const path = require('path')
const fs = require('fs/promises')
const { User } = require('../../model/user')
const Jimp = require("jimp");


router.get('/current', auth, async (req, res, next) => {
  try {
    const { name, email, subscription } = req.user;
    if (!email) {
      throw new Unauthorized("Not authorized")
    }
    res.json({
        status: "success",
        code: 200,
        data: {
            user: {
            name,
            email,
            subscription,
            }
        }
    })
  } catch (error) {
    next(error)
  }
  
})

const avatarsDir = path.join(__dirname, "../../", "public", "avatars")

router.patch('/avatars', auth, upload.single("avatar"), async(req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`
  try {
    const imgProcessed = await Jimp.read(tempUpload);
    await imgProcessed
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tempUpload);
    const resultUpload = path.join(avatarsDir, imageName)
    await fs.rename(tempUpload, resultUpload)
    const avatarURL = path.join("public", "avatars", originalname)
    await User.findByIdAndUpdate(req.user._id, {avatarURL})
    res.json({avatarURL})
  } catch (error) {
    await fs.unlink(tempUpload)
    throw error;
  }
  
})

module.exports = router;