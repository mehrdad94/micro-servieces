const path = require('path')

module.exports = {
  schemaVersion: 0,
  schema: [{
    primaryKey: 'email',
    name: 'User',
    properties: {
      email: 'string',
      token: 'string',
      verified: 'bool'
    }
  }],
  path: path.join(__dirname, '../DB/users.realm')
}
