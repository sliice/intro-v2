const {Schema, model} = require('mongoose')

const schema = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    type: {type: String},
    pic: {type: Array, default: [128522]},
    name: {type: String},
    surname: {type: String}
}, {
    strict: false
})

module.exports = model('User', schema)