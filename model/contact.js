const { Schema, model, SchemaTypes } = require('mongoose')

const contactSchema = Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,        
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: "user",
    }
}, { versionKey: false, timestamps: true })

const Contact = model("contact", contactSchema)

module.exports = {
    Contact
}