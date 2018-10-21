/* global test expect */
const path = require('path')
const fs = require('fs')
const request = require('request')
const apiConfig = require('../config/api')

// check server is ok
test('see is server up and running', function (done) {
  request.get(`http://localhost:${apiConfig.port}`, function (error, response, body) {
    if (error) throw new Error(error)

    expect(response.statusCode).toBe(200)

    done()
  })
})

// sign up request
test('sign up request', function (done) {
  signup('m_javidi@outlook.com')
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

// add image
test('add image request', function (done) {
  // image to upload
  const formData = {
    username: 'm_javidi@outlook.com',
    image: fs.createReadStream(path.join(__dirname, '/uploadImage.png'))
  }

  addImage(formData)
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

// user delete
test('user delete request', function (done) {
  deleteUser('m_javidi@outlook.com')
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

function signup (username) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/signup`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        username
      },
      json: true
    }, function (error, response, body) {
      if (error) {
        reject(error)
        return
      }
      resolve(body)
    })
  })
}

function addImage (formData) {
  return new Promise(function (resolve, reject) {
    request.post({
      url: `http://localhost:${apiConfig.port}/add_image`,
      formData,
      json: true
    }, function (error, httpResponse, body) {
      if (error) {
        reject(error)
        return
      }

      resolve(body)
    })
  })
}

function get (username) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/get`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        username
      },
      json: true
    }, function (error, response, body) {
      if (error) {
        reject(error)
        return
      }
      resolve(body)
    })
  })
}

function deleteUser (username) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/delete_user`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        username
      },
      json: true
    }, function (error, response, body) {
      if (error) {
        reject(error)
        return
      }
      resolve(body)
    })
  })
}
