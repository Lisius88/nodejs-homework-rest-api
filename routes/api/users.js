const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const {Unauthorized } = require('http-errors')


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

module.exports = router;