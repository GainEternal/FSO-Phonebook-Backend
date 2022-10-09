require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

const Contact = require('./models/contact')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('data', (req, res) => JSON.stringify(req.body))
morganString = ':method :url :status :res[content-length] - :response-time ms :data' 
app.use(morgan(morganString))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/info', (request, response) => {
  Contact.countDocuments({}, (err, count) => {
    response.send(
      `
      <div>
        Phonebook has info for ${count} people
      <div/><br>
      <div>
        ${Date()}
      <div/>
      `
    )
  });
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(contact => {
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then( result => {
      console.log(result);
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (Object.keys(body).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Number must exist'
    })
  }
  if (!body.name) {
    return response.status(400).json({
      error: 'Name must exist'
    })
  }
  if (alreadyExists(body.name)) {
    return response.status(400).json({
      error: 'Number must be unique'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
  .catch(error => next(error))
})

const alreadyExists = (name) => {
  return persons.some(p => p.name === name)
}

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const contact = {
    number: body.number
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
