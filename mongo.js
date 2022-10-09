const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(`Please provide the following arguments:
               password: 
               contact: (optional)
               number: (optional)
               node mongo.js <password> <contact> <number>`)
  process.exit(1)
}

const password = process.argv[2]
let name = ''
let number = ''

const url = process.env.MONGODB_URI

console.log('connecting to', url)

const processArgs = () => {
    if (process.argv.length == 3) {
        listContacts()
    }
    
    if (process.argv.length > 3) {
        name = process.argv[3]
    
        if (process.argv.length > 4) {
            number = process.argv[4]  
        }
        createContacts()
    }
}

const listContacts = () => {
    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected...')

            Contact.find({}).then(result => {
                result.forEach(contact => {
                  console.log(contact)
                })
                mongoose.connection.close()
            })
        })
        .catch((err) => console.log(err))
}

const createContacts = () => {
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected...')

        const contact = new Contact({
        name: name,
        number: number,
        })

        return contact.save()
    })
    .then(() => {
        console.log('contact saved!')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)


processArgs()




