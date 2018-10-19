/* global test expect */
const request = require('request')
const apiConfig = require('../config/api')
const uuidv1 = require('uuid/v1')
const commentId = uuidv1()
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

// add comment
test('add comment request', function (done) {
  const username = 'm_javidi@outlook.com'
  const senderId = 'm_javidi@gmail.com'
  const receiverId = 'm_javidi@outlook.com'
  const content = 'sample content'
  const date = new Date()

  addComment(username, commentId, senderId, receiverId, content, date)
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

// get comments
test('get comment request', function (done) {
  getComments('m_javidi@outlook.com')
    .then(data => {
      expect(data.data[0].content).toBe('sample content')
      done()
    })
})

// delete comment
test('delete comment request', function (done) {
  deleteComment('m_javidi@outlook.com', commentId)
    .then(data => {
      expect(data.status).toBe('SUCCESS')
      done()
    })
})

// delete user
test('delete user request', function (done) {
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

function addComment (username, id, senderId, receiverId, content, date) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/add_comments`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        username,
        id,
        senderId,
        receiverId,
        content,
        date
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

function getComments (username) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/get_comments`,
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

function deleteComment (username, id) {
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      uri: `http://localhost:${apiConfig.port}/delete_comment`,
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        username,
        id
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
