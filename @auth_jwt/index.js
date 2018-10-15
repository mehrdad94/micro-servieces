const express = require('express')
const bodyParser = require('body-parser')
const jwtService = require('./services/jwtService')
const log = require('./services/logService')
const apiConfig = require('./config/api')
const constants = require('./config/constants')
const app = express()

// express middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// introduction to service
app.get('/', (req, res) => log.log(res, { status: constants.SUCCESS }))

// signup
app.post('/signup', (req, res) => {
  jwtService.signup(req.body)
    .then((r) => log.log(res, r))
    .catch(e => log.error(res, e))
})

// login
app.post('/login', (req, res, next) => {
  jwtService.login(req.body)
    .then((r) => log.log(res, r))
    .catch(e => log.error(res, e))
})

// todo
// update password
// delete user

// is authenticated
app.post('/is_authenticated', (req, res) => {
  jwtService.isAuthenticated(req.headers)
    .then((r) => log.log(res, r))
    .catch(e => log.error(res, e))
})

// listen on port
app.listen(apiConfig.port, () => console.log(`Realm Database is listening on port ${apiConfig.port}!`))
