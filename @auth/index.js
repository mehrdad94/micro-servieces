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
  const { authType } = req.body

  if (!authType) {
    log.error(res, new Error(constants.INVALID_DATA))
    return
  }

  if (authType === 'JWT') {
    jwtService.signup(req.body)
      .then((r) => log.log(res, r))
      .catch(e => log.error(res, e))
    return
  }

  log.error(res, new Error(constants.NOT_FOUND))
})

// login
app.post('/login', (req, res, next) => {
  const { authType } = req.body

  if (!authType) {
    log.error(res, new Error(constants.INVALID_DATA))
    return
  }

  if (authType === 'JWT') {
    jwtService.login(req.body)
      .then((r) => log.log(res, r))
      .catch(e => log.error(res, e))
    return
  }

  log.error(res, new Error(constants.NOT_FOUND))
})

// todo
// update password
// delete user

// is authenticated
app.post('/is_authenticated', (req, res) => {
  const { authType } = req.body

  if (!authType) {
    log.error(res, new Error(constants.INVALID_DATA))
    return
  }

  if (authType === 'JWT') {
    jwtService.isAuthenticated(req.headers)
      .then((r) => log.log(res, r))
      .catch(e => log.error(res, e))

    return
  }

  log.error(res, new Error(constants.NOT_FOUND))
})

// listen on port
app.listen(apiConfig.port, () => console.log(`Realm Database is listening on port ${apiConfig.port}!`))
