const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('data', (req, res) => JSON.stringify(req.body))
morganString = ':method :url :status :res[content-length] - :response-time ms :data' 
app.use(morgan(morganString))
app.use(express.static('build'))

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
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(
    `
    <div>
      Phonebook has info for ${persons.length} people
    <div/><br>
    <div>
      ${Date()}
    <div/>
    `
    )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body) {
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

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const alreadyExists = (name) => {
  return persons.some(p => p.name === name)
}

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}
  
app.post('/api/notes', (request, response) => {
    const body = request.body
    console.log(body);

    if (!body.content) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
