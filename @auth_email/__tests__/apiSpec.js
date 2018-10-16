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
