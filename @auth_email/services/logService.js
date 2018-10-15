const constants = require('../config/constants')

const logService = {
  error: function (res, error) {
    console.log(error)
    switch (error.message) {
      case constants.INVALID_DATA:
        res.sendStatus(400)
        break
      case constants.UNAUTHENTICATED:
        res.sendStatus(403)
        break
      case constants.NOT_FOUND:
        res.sendStatus(404)
        break
      default:
        res.sendStatus(500)
        break
    }
  },
  log: function (res, log) {
    res.status(200).json(log)
  }
}

module.exports = logService
