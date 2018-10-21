const uuid4 = require('uuid/v4')
const del = require('del')
const constants = require('../config/constants')
const realm = require('./realmService')
const dbConfig = require('../config/dbConfig')
const apiConfig = require('../config/api')

const findUser = username => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'User',
      filter: `username = "${username}"`
    }
  })
}
const updateUser = updateObj => {
  return realm.dbWrite({
    dbConfig,
    update: true,
    schemaType: 'User',
    schemaValue: {
      ...updateObj
    }
  })
}
const findImage = id => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'Image',
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
      images: []
    }
  })
}

const delObj = obj => {
  return realm.dbDelete({
    dbConfig,
    obj
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

          // delete images
          const imagesPath = data[0].images.map(name => `${apiConfig.uploadDir}/${name.filename}`)

          del(imagesPath).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'))
          })

          delObj(data)
            .then(() => {
              resolve({ status: constants.SUCCESS })
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  addImage: function (bodyPayload, filePayload) {
    return new Promise(function (resolve, reject) {
      const id = uuid4()
      const date = new Date()

      const { originalname, filename, mimetype, size } = filePayload

      const { username } = bodyPayload

      if (!username) {
        reject(new Error(constants.INVALID_DATA))
        return
      }

      if (!originalname || !filename || !mimetype || !size) {
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
          const images = [...data[0].images, {
            id,
            date,
            originalname,
            filename,
            mimetype,
            size
          }]

          // add user
          updateUser({ username, images })
            .then(() => {
              resolve({ status: constants.SUCCESS })
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  getImages: function (payload) {
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

          resolve({ status: constants.SUCCESS, data: data[0].images })
        })
        .catch(e => reject(e))
    })
  },
  deleteImage: function (payload) {
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

          findImage(id)
            .then(data => {
              if (!Object.keys(data).length) {
                resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
                return
              }
              // delete images
              const imagesPath = `${apiConfig.uploadDir}/${data[0].filename}` // data[0].filename .images.map(name => `${apiConfig.uploadDir}/${name.filename}`)

              del(imagesPath).then(paths => {
                console.log('Deleted files and folders:\n', paths.join('\n'))
              })

              delObj(data)
                .then(() => {
                  resolve({ status: constants.SUCCESS })
                })
                .catch(e => reject(e))
            })
        })
        .catch(e => reject(e))
    })
  }
}

module.exports = commentService
