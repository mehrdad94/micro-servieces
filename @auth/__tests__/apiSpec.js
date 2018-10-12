/* global test expect */
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

// login request
test('login request', function (done) {
  login('mehrdad', 'mehssrdad')
    .then(data => {
      // error message
      expect(data.data).toBe('INVALID_PASSWORD')
      done()
    })
})

test('login request', function (done) {
  login('mehrdad', 'mehrdad')
    .then(data => {
      // token
      expect(!!data.data).toBe(true)
      done()
    })
})

test('login request', function (done) {
  login('mehrdad1', 'whatever')
    .then(data => {
      // token
      expect(data.data).toBe('USER_NOT_FOUND')
      done()
    })
})
// sign up request
test('sign up request', function (done) {
  signup('mehrdad', 'mehrdad')
    .then(data => {
      // token
      expect(data.data).toBe('DUPLICATE_USER')
      done()
    })
})

function login (username, password) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        authType: 'JWT',
        username,
        password
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

function signup (username, password) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/signup`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        authType: 'JWT',
        username,
        password
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
