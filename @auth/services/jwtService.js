const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const realm = require('./realmService')
const dbConfig = require('../config/dbConfig')
const constants = require('../config/constants')
const privateKey = fs.readFileSync('./config/private.key', 'utf8')
const publicKey = fs.readFileSync('./config/public.key', 'utf8')

const saltGen = () => crypto.randomBytes(16).toString('hex')

const hashGen = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
}

const validatePassword = (password, savedHash, savedSalt) => {
  const hash = crypto.pbkdf2Sync(password, savedSalt, 10000, 512, 'sha512').toString('hex')
  return savedHash === hash
}

const JWTGen = username => {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    username,
    exp: parseInt(expirationDate.getTime() / 1000, 10)
  }, privateKey, { algorithm: 'RS256' })
}

const toAuthJSON = username => {
  return {
    username,
    token: JWTGen(username)
  }
}

const findUser = username => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'User',
      filter: `username = "${username}"`
    }
  })
}

const addUser = (username, password) => {
  const salt = saltGen()
  const hash = hashGen(password, salt)

  return realm.dbWrite({
    dbConfig,
    update: false,
    schemaType: 'User',
    schemaValue: {
      username,
      salt,
      hash
    }
  })
}

const authService = {
  signup: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username, password } = payload

      // check is username and password exist
      if (!username || !password) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      // find the user
      findUser(username)
        .then(data => {
          // check is dupplicate
          if (Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.DUPLICATE_USER })
            return
          }

          // add user to database
          addUser(username, password)
            .then(() => {
              resolve({ status: constants.SUCCESS, data: toAuthJSON(username) })
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  login: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username, password } = payload

      // check is username and password exist
      if (!username || !password) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      findUser(username)
        .then(data => {
          // check is any user there
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          // check for password validation
          const valid = validatePassword(password, data[0].hash, data[0].salt)

          if (valid) resolve({ status: constants.SUCCESS, data: toAuthJSON(username) })
          else resolve({ status: constants.ERROR, data: constants.INVALID_PASSWORD })
        })
    })
  },
  isAuthenticated: function (headers) {
    return new Promise(function (resolve, reject) {
      const token = headers['x-access-token']

      if (!token) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      // validate token
      jwt.verify(token, publicKey, { algorithm: ['RS256'] }, function (err, decoded) {
        if (err) {
          reject(new Error(constants.UNAUTHENTICATED))
          return
        }

        resolve({ status: constants.SUCCESS, data: decoded })
      })
    })
  }
}

module.exports = authService
