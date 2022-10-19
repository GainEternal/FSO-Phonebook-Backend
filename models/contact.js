const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then((result) => {
        console.log('connected to MongoDB')
    })
    .catch((err) => console.log('error connecting to MongoDB:', err.message))

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    validate: [
        {
            validator: (value) => {
                return Contact.findOne({ name: value })
                    .then(result => {
                        if (result == null) {
                            return true
                        } else {
                            return false
                        }
                    })
                    .catch(err => console.log(err.message))
            },
            msg: 'Duplicate name. Name must be unique'
        }
    ]
  },
  number: {
    type: String,
    validate: [
        { 
            validator: (str) => {
                return !/[^0-9-]/g.test(str)
            },
            msg: `Contains invalid character. Only digits and '-' (hyphen) allowed`
        },
        { 
            validator: (str) => {
                return str.replace(/[^0-9]/g, '').length >= 8
            },
            msg: 'Not enough digits; requires 8 or more'
        },
        { 
            validator: (str) => {
                if (str.includes('-')) {
                    return /^\d{2,3}-\d{5,}$/.test(str)
                }
                return true
            },
            msg: 'Number not in correct form. Must have 2-3 digits followed by at least 5 digits'
        },
    ],
    required: true
  }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
