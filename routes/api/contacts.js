const express = require('express')
const router = express.Router()

const Joi = require('joi')
const { Contact } = require("../../model/contact")
const auth = require('../../middlewares/auth')

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
})

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.bool(),
})

const favoriteJoiSchema = Joi.object({
  favorite: Joi.bool().required(),
})

router.get('/', auth, async (req, res, next) => {
  try {
   const { _id } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({owner: _id}, "", {skip, limit:Number(limit)}).populate("owner", "_id name email");
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    }
  })
  } catch (error) {
    next(error)
  }
  
})

router.get('/:contactId', auth,  async (req, res, next) => {
try {
  const {contactId} = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    const error = new Error("Contact with each id not found")
    error.status = 404;
    throw error;

  }
    res.json({
    status: "success",
    code: 200,
    data: {
      result: contact,
    }
  })
} catch (error) {
  next(error)
}
})

router.post('/', auth, async (req, res, next) => {
  try {
    const { _id } = req.user;
      const { error } = contactSchema.validate(req.body);
  if (error) {
    error.status = 400;
    throw error;
  }
  const addingContact = await Contact.create({...req.body, owner: _id});
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        result: addingContact,
      }
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {

  try {
  const {contactId} = req.params;
  const deletingContact = await Contact.findByIdAndRemove(contactId)
  if (!deletingContact) {
    const error = new Error("Contact with each id not found")
    error.status = 404;
    throw error;

  }
    res.json({
    status: "success",
    code: 200,
    data: {
      result: deletingContact,
    }
  })
} catch (error) {
  next(error)
}
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = putSchema.validate(req.body);
  if (error) {
    error.status = 400;
    throw error;
    
    }
    const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if (!contact) {
    const error = new Error("Contact with each id not found")
    error.status = 404;
    throw error;

  }
    res.json({
    status: "success",
    code: 200,
    data: {
      result: contact,
    }
  })
} catch (error) {
  next(error)
}
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const {error} = favoriteJoiSchema.validate({favorite});
  if (error) {
    error.status = 400;
    throw error;
    }
  const contact = await Contact.findByIdAndUpdate(contactId, {favorite}, {new: true});
  if (!contact) {
    const error = new Error("Contact with each id not found")
    error.status = 404;
    throw error;

  }
    res.json({
    status: "success",
    code: 200,
    data: {
      result: contact,
    }
  })
} catch (error) {
  next(error)
}
})

module.exports = router
