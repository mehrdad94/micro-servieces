const express = require('express')
const bodyParser = require('body-parser')
const log = require('./services/logService')
const locationService = require('./services/locationService')
const apiConfig = require('./config/api')
const constants = require('./config/constants')
const app = express()

// express middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// introduction to service
app.get('/', (req, res) => log.log(res, { status: constants.SUCCESS }))

// add user
app.post('/signup', (req, res) => {
  // request to add user
  locationService
    .signup(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// update user
app.post('/update', (req, res) => {
  locationService
    .updateUser(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// get user
app.post('/get', (req, res) => {
  locationService
    .getUser(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// delete user
app.post('/delete', (req, res) => {
  locationService
    .deleteUser(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// listen on port
app.listen(apiConfig.port, () => console.log(`Realm Database is listening on port ${apiConfig.port}!`))
