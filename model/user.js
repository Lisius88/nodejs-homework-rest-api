const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const bcrypt = require('bcrypt');
const handleSchemaValidationError = require('../helpers/handleSchemaValidationError')

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
    },
    token: {
        type: String,
        default: null,
    }
}, { versionKey: false, timestamps: true })

userSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setToken = function (payload) {
    this.token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

userSchema.methods.deleteToken = function () {
    this.token = null;
};

userSchema.post('save', handleSchemaValidationError);

const User = model('user', userSchema)

module.exports = {
    User
}