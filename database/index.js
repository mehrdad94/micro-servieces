const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config/config')
const logConstants = require('./config/logConstants')
const realmService = require('./DBServices/realmService')
const app = express()

// parse as json
app.use(bodyParser.json({ type: 'application/*+json' }))

// introduction to service
app.get('/', (req, res) => res.send(logConstants.SUCCESS))

// write in database
app.post('/write', (req, res) => {
  realmService.dbWrite(req.body)
              .then(data => res.send(logConstants.SUCCESS))
              .catch(err => res.send(err))
})

// query database
app.get('/query', (req, res) => {
  realmService.dbQuery(req.body)
              .then(data => res.send(data))
              .catch(err => res.send(err))
})

// listen on port
app.listen(config.port, () => console.log(`Realm Database is listening on port ${config.port}!`))
