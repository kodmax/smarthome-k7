'use strict'

const fs = require('fs')
const path = require('path')

const upSql = path.join(__dirname, 'sqls', '20260706152000-initial-up.sql')
const downSql = path.join(__dirname, 'sqls', '20260706152000-initial-down.sql')

function readSql(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

exports.up = function (db) {
  return readSql(upSql).then(sql => db.runSql(sql))
}

exports.down = function (db) {
  return readSql(downSql).then(sql => db.runSql(sql))
}

exports._meta = {
  version: 1,
}
