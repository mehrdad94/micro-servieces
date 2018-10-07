/*
  test cases
  dbConfigValidation
  dbOpen
  dbWrite (update and add)
  dbQuery
  dbDelete
*/

const path = require('path')
const realmService = require('../DBServices/realmService')

test('dbConfigValidation, config validation', function () {
  const dbConfig = {
    schema: [],
  }
  let evaluation = realmService.dbConfigValidation(dbConfig)

  expect(evaluation).toBe(false)
})

test('dbConfigValidation, config validation', function () {
  const dbConfig = {
    path: 'm'
  }
  let evaluation = realmService.dbConfigValidation(dbConfig)

  expect(evaluation).toBe(false)
})

test('dbConfigValidation, config validation', function() {
  const dbConfig = {
    schema: [],
    path: 'h'
  }
  let evaluation = realmService.dbConfigValidation(dbConfig)

  expect(evaluation).toBe(true)
})

test('write and update database', function () {
  const dbConfig = {
    schema: [{ primaryKey: 'id', name: 'Car', properties: { model: 'string', id: 'string' } }],
    schemaVersion: 0,
    path: path.join(__dirname, '../DBs/test.realm')
  }

  let dataToWrite = {
    schemaType: 'Car',
    schemaValue: {
      id: '123456',
      model: 'BMW'
    }
  }

  let dataToUpdate = {
    schemaType: 'Car',
    schemaValue: {
      id: '123456',
      model: 'mercedes'
    }
  }
  return realmService.dbWrite({
    dbConfig,
    update: false,
    ...dataToWrite
  }).then(() => {
    expect(true).toBe(true)
    realmService.dbWrite({
      dbConfig,
      update: true,
      ...dataToUpdate
    }).then(() => {
      expect(true).toBe(true)
    }).catch((e) => {
      throw new Error(e)
    })
  })
  .catch((e) => {
    throw new Error(e)
  })
})

test('read and dalete in database', function () {
  const dbConfig = {
    schema: [{ primaryKey: 'id', name: 'Car', properties: { model: 'string', id: 'string' } }],
    path: path.join(__dirname, '../DBs/test.realm')
  }

  realmService.dbQuery({
    dbConfig,
    query: {
      find: 'Car'
    }
  }).then(result => {
    realmService.dbDelete({
      dbConfig,
      obj: result
    }).then(() => {
      expect(true).toBe(true)
    }).catch(e => {
      throw new Error(e)
    })
  }).catch(e => {
    throw new Error(e)
  })
})
