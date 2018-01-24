const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.statics.format = function(person) {
    const formattedPerson = { ...person._doc, id: person._id }
    return person
}

const Person = mongoose.model('person', personSchema)

module.exports = Person