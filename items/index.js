const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config/config')
const logConstants = require('./config/logConstants')
const app = express()

// parse as json
app.use(bodyParser.json({ type: 'application/*+json' }))

// introduction to service
app.get('/', (req, res) => res.send(logConstants.SUCCESS))

// add item
app.post('/itemsAdd', (req, res) => {

})

// delete item
app.post('/itemsDelete', (req, res) => {

})

// update item
app.post('/itemsUpdate', (req, res) => {

})

// query item
app.post('/itemsQuery', (req, res) => {

})

// listen on port
app.listen(config.port, () => console.log(`Realm Database is listening on port ${config.port}!`))
