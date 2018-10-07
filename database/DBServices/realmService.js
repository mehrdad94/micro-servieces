const Realm = require('realm')

const dbConfigValidation = function (dbConfig) {
  if (dbConfig.constructor !== Object) return false
  if (!dbConfig.schema) return false
  if (!dbConfig.path) return false
  return true
}

const dbOpen = function (dbConfig) {
  return Realm.open(dbConfig)
}

const dbWrite = function (payload) {
  let { dbConfig, schemaType, schemaValue, update } = payload

  if (!dbConfig || !schemaType || !schemaValue) {
    return false
  }

  if (!dbConfigValidation(dbConfig)) {
    return false
  }

  return dbOpen(dbConfig).then(function (realm) {
    return realm.write(() => {
      return realm.create(schemaType, schemaValue, update)
    })
  })
}

const dbQuery = function (payload) {
  let { dbConfig, query} = payload

  if (!dbConfig || !query || !query.find) {
    return false
  }

  if (!dbConfigValidation(dbConfig)) {
    return false
  }

  return dbOpen(dbConfig).then(function (realm) {
    let result = realm.objects(query.find)
    if (query.filter) return result.filtered(query.filter)
    else return result
  })
}

const dbDelete = function (payload) {
  let { dbConfig, obj} = payload

  return dbOpen(dbConfig).then(function (realm) {
    realm.write(() => {
      realm.delete(obj)
    })
  })
}

const dbService = {
  dbConfigValidation,
  dbQuery,
  dbWrite,
  dbDelete
}

module.exports = dbService
