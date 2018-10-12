const path = require('path')

module.exports = {
  schema: [{
    primaryKey: 'username',
    name: 'User',
    properties: {
      username: 'string',
      hash: 'string',
      salt: 'string'
    }
  }],
  path: path.join(__dirname, '../DB/users.realm')
}
