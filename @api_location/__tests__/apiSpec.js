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

// sign up request
test('sign up request', function (done) {
  signup('m_javidi@outlook.com')
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

// update request
test('update request', function (done) {
  update('m_javidi@outlook.com', '2', '1')
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

// user get
test('user get request', function (done) {
  get('m_javidi@outlook.com')
    .then(data => {
      expect(data.data.lat).toBe('2')
      done()
    })
})

// user delete
test('user get request', function (done) {
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

function update (username, lat, lang, address) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/update`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        username,
        lat,
        lang,
        address
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
      uri: `http://localhost:${apiConfig.port}/delete`,
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
