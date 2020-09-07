const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    link: {type: String},
    q: {type: Number},
    description: {type: String},
    shortDescription: {type: String},
    date: {type: Date, default: Date.now},
    scales: [{
        name: {type: String},
        intervals: [{
            name: {type: String},
            description: {type: String},
            min: {type: Number, default: 0},
            max: {type: Number, default: 0},
            important: {type: Boolean, default: false},
        }],
        scaleanswers: [{
            k: {type: Number, default: 1},
            questions: {type: Array}
        }]
    }],
    questions: {type: Array},
    answers: {type: Array}
},
    {
        collection: 'tests',
        strict: false
    })

module.exports = model('Test', schema)