const crypto = require('crypto')
const nodemailer = require('nodemailer')
const realm = require('./realmService')
const nodemailerConfig = require('../config/nodemailer')
const dbConfig = require('../config/dbConfig')
const constants = require('../config/constants')

const transporter = nodemailer.createTransport(nodemailerConfig)

const tokenGen = () => crypto.randomBytes(16).toString('hex')

const emailContent = token => {
  return `Hello,\n\n
          Please verify your account by clicking the link: \n
          http:localhost:3002/confirmation?token=${token} .\n`
}

const emailSubject = () => 'account verification'

const addUser = (email, token) => {
  return realm.dbWrite({
    dbConfig,
    update: false,
    schemaType: 'User',
    schemaValue: {
      email,
      token,
      verified: false
    }
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
const findUser = email => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'User',
      filter: `email = "${email}"`
    }
  })
}

const findToken = token => {
  return realm.dbQuery({
    dbConfig,
    query: {
      find: 'User',
      filter: `token = "${token}"`
    }
  })
}

const sendMail = function (payload) {
  return new Promise(function (resolve, reject) {
    const { from, to, token } = payload

    // mailOptions validation
    if (!from || !to || !token) {
      reject(new Error(constants.INVALID_DATA))
      return
    }

    // create mailOptions
    const mailOptions = {
      from,
      to,
      subject: emailSubject(),
      text: emailContent(token)
    }

    // send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(new Error(constants.ERROR))
      } else {
        resolve({ status: constants.SUCCESS, data: token })
      }
    })
  })
}

const verificationService = {
  signUp: function (email) {
    return new Promise(function (resolve, reject) {
      // see if the user exist
      findUser(email)
        .then(data => {
          if (Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_EXISTS })
            return
          }

          // generate token
          const token = tokenGen()

          // add user and send token
          addUser(email, token)
            .then(() => {
              sendMail({
                from: nodemailerConfig.auth.user,
                to: email,
                token
              }).then(resolve({ status: constants.SUCCESS }))
                .catch(e => reject(e))
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  confirmToken: function (token) {
    return new Promise(function (resolve, reject) {
      findToken(token)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          if (data[0].verified) {
            resolve({ status: constants.ERROR, data: constants.USER_VERIFIED })
            return
          }

          updateUser({
            email: data[0].email,
            verified: true
          }).resolve(resolve({ status: constants.SUCCESS }))
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  resendToken: function (email) {
    return new Promise(function (resolve, reject) {
      findUser(email)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          // check is already verified
          if (data[0].verified) {
            resolve({ status: constants.ERROR, data: constants.USER_VERIFIED })
            return
          }

          // generate token
          const token = tokenGen()

          sendMail({
            from: nodemailerConfig.auth.user,
            to: email,
            token
          }).then(() => {
            updateUser({
              email: data[0].email,
              token: token
            }).resolve(resolve({ status: constants.SUCCESS }))
              .catch(e => reject(e))
          }).catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
  },
  userVerified: function (email) {
    return new Promise(function (resolve, reject) {
      findUser(email)
        .then(data => {
          if (!Object.keys(data).length) {
            resolve({ status: constants.ERROR, data: constants.USER_NOT_FOUND })
            return
          }

          resolve({ status: constants.SUCCESS, data: data[0].verified })
        })
        .catch(e => reject(e))
    })
  }
}

module.exports = verificationService
