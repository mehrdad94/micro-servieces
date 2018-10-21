const path = require('path')

const imageSchema = {
  primaryKey: 'id',
  name: 'Image',
  properties: {
    id: 'string',
    date: 'date',
    originalname: 'string', // real image name
    filename: 'string', // saved name in disc
    mimetype: 'string',
    size: 'int'
  }
}

const userSchema = {
  primaryKey: 'username',
  name: 'User',
  properties: {
    username: 'string',
    images: { type: 'list', objectType: 'Image' }
  }
}

module.exports = {
  schemaVersion: 0,
  schema: [imageSchema, userSchema],
  path: path.join(__dirname, '../DB/users.realm')
}
