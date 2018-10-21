const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser')
const log = require('./services/logService')
const imageService = require('./services/imageService')
const apiConfig = require('./config/api')
const constants = require('./config/constants')
const upload = require('./config/multer')

const app = express()

// express middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// introduction to service
app.get('/', (req, res) => log.log(res, { status: constants.SUCCESS }))

// add user
app.post('/signup', (req, res) => {
  // request to add user
  imageService
    .signup(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// add comments
app.post('/add_image', upload.single('image'), (req, res) => {
  imageService
    .addImage(req.body, req.file)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// get comments
app.post('/get_images', (req, res) => {
  imageService
    .getImages(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// delete comment
app.post('/delete_image', (req, res) => {
  imageService
    .deleteImage(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// delete user
app.post('/delete_user', (req, res) => {
  imageService
    .deleteUser(req.body)
    .then(r => log.log(res, r))
    .catch(e => log.error(res, e))
})

// listen on port
app.listen(apiConfig.port, () => console.log(`Images Database is listening on port ${apiConfig.port}!`))
