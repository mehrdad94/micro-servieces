const constants = require('../config/constants')
const realm = require('./realmService')
const dbConfig = require('../config/dbConfig')

const addUser = (username) => {
  return realm.dbWrite({
    dbConfig,
    update: false,
    schemaType: 'User',
    schemaValue: {
      username,
      lat: '',
      lang: '',
      address: ''
    }
  })
}
const userDelete = obj => {
  return realm.dbDelete({
    dbConfig,
    obj
  })
}
const updateUser = (updateObj) => {
  return realm.dbWrite({
    dbConfig,
    update: true,
    schemaType: 'User',
    schemaValue: {
      ...updateObj
    }
  })
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

const locationService = {
  signup: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      // see if the user exist
      findUser(username)
        .then(data => {
          if (Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_EXISTS })
            return
          }
          // add user
          addUser(username)
            .then(() => {
              resolve({ status: constants.SUCCESS })
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  updateUser: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username, lat, lang, address } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      // see if the user exist
      findUser(username)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          // add user
          updateUser({
            username,
            lat,
            lang,
            address
          }).then(() => {
            resolve({ status: constants.SUCCESS })
          }).catch(e =>
            reject(e)
          )
        })
        .catch(e => reject(e))
    })
  },
  getUser: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      // see if the user exist
      findUser(username)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          resolve({ status: constants.SUCCESS, data: data[0] })
        })
        .catch(e => reject(e))
    })
  },
  deleteUser: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      findUser(username)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          userDelete(data)
            .then(() => resolve({ status: constants.SUCCESS }))
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  }
}

module.exports = locationService
