const request = require('request')

test('see is server up and running', function(done) {
  request.get('http://localhost:3000', function (error, response, body) {
    if (error) throw new Error(error)

    expect(response.statusCode).toBe(200)

    done()
  })
})

// TODO add more test
