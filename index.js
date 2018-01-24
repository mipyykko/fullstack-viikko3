const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(express.static('public'))

// let persons = [
//     {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//     },
//     {
//     "name": "Martti Tienari",
//     "number": "040-123456",
//     "id": 2
//     },
//     {
//     "name": "Arto Järvinen",
//     "number": "040-123456",
//     "id": 3
//     },
//     {
//     "name": "Lea Kutvonen",
//     "number": "040-123456",
//     "id": 4
//     }
// ]

app.get('/info', (req, res) => {
    Person
        .count({})
        .then(count => {
            res.send(`<p>puhelinluettelossa ${count} henkilön tiedot</p><p>${new Date().toString()}</p>`)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({}, {__v: 0})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }
/*     if (persons.find(n => 
        n.name.toLowerCase().trim() === newPerson.name.toLowerCase().trim())) {
            return res.status(400).json({ error: 'name already exists' })
        }
 */
    const newPerson = new Person({
        name: body.name,
        number: body.number
    }) 

    newPerson
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .deleteOne({ id: req.params.id })
        .then(c => {
            res.status(204).end()
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
