const path = require('path')

const commentSchema = {
  primaryKey: 'id',
  name: 'Comment',
  properties: {
    id: 'string',
    senderId: 'string',
    receiverId: 'string',
    content: 'string',
    date: 'date'
  }
}

const userSchema = {
  primaryKey: 'username',
  name: 'User',
  properties: {
    username: 'string',
    comments: { type: 'list', objectType: 'Comment' }
  }
}

module.exports = {
  schemaVersion: 0,
  schema: [commentSchema, userSchema],
  path: path.join(__dirname, '../DB/users.realm')
}
