const express = require('express')
const bodyParser = require('body-parser')
const log = require('./services/logService')
const commentService = require('./services/commentService')
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
  commentService
    .signup(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// add comments
app.post('/add_comments', (req, res) => {
  commentService
    .addComments(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// get comments
app.post('/get_comments', (req, res) => {
  commentService
    .getComments(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// delete comment
app.post('/delete_comment', (req, res) => {
  commentService
    .deleteComment(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// delete user
app.post('/delete_user', (req, res) => {
  commentService
    .deleteUser(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// listen on port
app.listen(apiConfig.port, () => console.log(`Realm Database is listening on port ${apiConfig.port}!`))
