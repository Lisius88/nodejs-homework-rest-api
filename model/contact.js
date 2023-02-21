const { Schema, model } = require('mongoose')

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
    // favorite: {
    //     type: Boolean,
    //     require: true,
    // }
}, { versionKey: false, timestamps: true })

const Contact = model("contact", contactSchema)

module.exports = {
    Contact
}