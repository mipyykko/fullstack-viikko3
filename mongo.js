const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('person', {
  name: String,
  number: String
})

if (process.argv.length === 2) {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(p => console.log(p))
      mongoose.connection.close()
      process.exit()
    })
} else if (process.argv.length !== 4) {
  throw new Error('illegal arguments')
} else {
  const newPerson = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  newPerson
    .save()
    .then(addedPerson => {
      console.log(`lisätty ${addedPerson.name} numerolla ${addedPerson.number} tietokantaan`)
      mongoose.connection.close()
    })
}