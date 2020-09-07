const {Schema, model} = require('mongoose')

const schema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    grade: {type: Number, required: true},
    letter: {type: String},
    birthday: {type: Date}
},
    {collection: 'students'})

module.exports = model('Student', schema)