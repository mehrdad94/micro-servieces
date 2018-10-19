const constants = require('../config/constants')
const realm = require('./realmService')
const dbConfig = require('../config/dbConfig')

const findUser = username => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'User',
      filter: `username = "${username}"`
    }
  })
}

const findMessage = id => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'Comment',
      filter: `id = "${id}"`
    }
  })
}

const addUser = username => {
  return realm.dbWrite({
    dbConfig,
    update: false,
    schemaType: 'User',
    schemaValue: {
      username,
      comments: []
    }
  })
}

const delObj = obj => {
  return realm.dbDelete({
    dbConfig,
    obj
  })
}

const updateUser = (username, comments) => {
  return realm.dbWrite({
    dbConfig,
    update: true,
    schemaType: 'User',
    schemaValue: {
      username,
      comments
    }
  })
}

const commentService = {
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
  deleteUser: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      findUser(username)
        .then(data => {
          // see if the user exist
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          delObj(data)
            .then(() => {
              resolve({ status: constants.SUCCESS })
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  addComments: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username, id, content, date, senderId, receiverId } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      if (!id || !content || !date || !senderId || !receiverId) {
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

          // add comment
          const comments = [...data[0].comments, {
            id,
            content,
            date,
            senderId,
            receiverId
          }]

          // add user
          updateUser(username, comments)
            .then(() => {
              resolve({ status: constants.SUCCESS })
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  getComments: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
      }

      // see if the user exist
      findUser(username)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          resolve({ status: constants.SUCCESS, data: data[0].comments })
        })
        .catch(e => reject(e))
    })
  },
  deleteComment: function (payload) {
    return new Promise(function (resolve, reject) {
      const { username, id } = payload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
      }

      // see if the user exist
      findUser(username)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          findMessage(id)
            .then(data => {
              if (!Object.keys(data).length) {
                resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
                return
              }

              delObj(data)
                .then(() => {
                  resolve({ status: constants.SUCCESS })
                })
                .catch(e => reject(e))
            })
          // resolve({ status: constants.SUCCESS, data: data[0].comments })
          // find that comment
        })
        .catch(e => reject(e))
    })
  }
}

module.exports = commentService
