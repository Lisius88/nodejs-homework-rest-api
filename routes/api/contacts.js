const express = require('express')
const router = express.Router()

const Joi = require('joi')
const {Contact} = require("../../model/contact")

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

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find({});
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

router.get('/:contactId', async (req, res, next) => {
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

router.post('/', async (req, res, next) => {
  try {
      const { error } = contactSchema.validate(req.body);
  if (error) {
    error.status = 400;
    throw error;
  }
  const addingContact = await Contact.create(req.body);
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
