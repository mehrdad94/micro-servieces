const express = require('express')
const bodyParser = require('body-parser')
const verificationService = require('./services/verificationService')
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
  const { email } = req.body

  if (!email) {
    log.error(res, { status: constants.INVALID_DATA })
    return
  }

  verificationService
    .signUp(email)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// resendtoken
app.post('/resendtoken', (req, res) => {
  const { email } = req.body

  if (!email) {
    log.error(res, { status: constants.INVALID_DATA })
    return
  }

  verificationService
    .resendToken(email)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

app.post('/isverified', (req, res) => {
  const { email } = req.body

  if (!email) {
    log.error(res, { status: constants.INVALID_DATA })
    return
  }

  verificationService
    .userVerified(email)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

app.get('/confirmation', (req, res) => {
  const { token } = req.query

  if (!token) {
    log.error(res, { status: constants.INVALID_DATA })
    return
  }

  verificationService
    .confirmToken(token)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// listen on port
app.listen(apiConfig.port, () => console.log(`Realm Database is listening on port ${apiConfig.port}!`))
