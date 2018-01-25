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
        .find({})
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
        .catch(_ => {
            res.status(400).send({ error: 'not found' })
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
    const newPerson = new Person({
        name: body.name,
        number: body.number
    }) 

    Person
        .find({ name: newPerson.name.toLowerCase().trim() })
        .then(result => {
            if (result.length > 0) {
                return res.status(400).json({ error: 'already exists!' })
            } else {
                newPerson
                .save()
                .then(savedPerson => {
                    res.json(Person.format(savedPerson))
                })
                .catch(_ => {
                    res.status(400).send({ error: '??!' })
                })
            }})
        .catch(_ => res.status(400).send({ error: '??!?' }))
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(_ => {
            res.status(204).end()
        })
        .catch(_ => {
            res.status(400).send({ error: 'bad id' })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(e => {
            res.status(400).send({ error: 'bad id '})
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
