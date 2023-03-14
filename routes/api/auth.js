const express = require('express')
const router = express.Router()
const { Conflict, Unauthorized } = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar');
const { User } = require('../../model/user')
const { SECRET_KEY } = process.env
const auth = require('../../middlewares/auth')
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../../helpers/sendEmail')




router.post('/signup', async (req, res, next) => {
    try {
    const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Conflict(`User with ${email} already exist`)
      }
      const verificationToken = uuidv4()
      const avatarURL = gravatar.url(email, { protocol: 'https' });
      const newUser = new User({ name, email, avatarURL, verificationToken })
      newUser.setPassword(password)
      await newUser.save()
      const mail = {
        to: email,
        subject: "Confirmation email",
        html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm email</a>`,
      }
      await sendEmail(mail)

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      name,
      email,
      avatarURL,
      verificationToken,
    }
  })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      const passCompare = bcrypt.compareSync(password, user.password)
      if (!user || !user.verify || !passCompare) {
        throw new Unauthorized("Email or verify or password wrong")
      }
      const payload = {
          id: user._id,
      }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" })
    await User.findByIdAndUpdate(user._id, {token})
      res.json({
    status: "success",
    code: 200,
    data: {
        token,
    }
  })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', auth, async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null })
    res.status(204).json();
  } catch (error) {
    next(error)
  }
})

module.exports = router;