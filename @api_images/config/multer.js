const multer = require('multer')
const mime = require('mime')
const uuidv1 = require('uuid/v1')
const apiConf = require('./api')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${apiConf.uploadDir}/`)
  },
  filename: (req, file, cb) => {
    const fileExt = mime.getExtension(file.mimetype)

    if (!fileExt) cb(null, null)

    const filename = `${uuidv1()}.${fileExt}`

    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

module.exports = upload
