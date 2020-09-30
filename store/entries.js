const fs = require('fs')
const entriesStore = require('./entries.json')
const entries = entriesStore.data

function writeEntries() {
  const newEntriesStoreString = JSON.stringify(entriesStore)

  return new Promise(resolve =>
    fs.writeFile('store/entries.json', newEntriesStoreString, err =>
      resolve(err)
    ))
}

function findEntry(id) {
  for (const [ i, entry ] of entries.entries()) {
    if (entries[i].id === Number(id)) {
      return [ i, entry ]
    }
  }

  return [ null, null ]
}

exports.findEntry = findEntry

exports.getEntries = function() {
  return entries
}

exports.addEntry = function(newEntry) {
  newEntry.id = entriesStore.nextId++

  entries.push(newEntry)

  return writeEntries()
    .then(err => {
      if (err) {
        throw 500
      } else {
        return newEntry.id
      }
    })
}

exports.editEntry = function(entry) {
  const [ i ] = findEntry(entry.id)

  if (i !== null) {
    entry.dateEdited = Date.now()

    entries[i] = entry

    return writeEntries()
      .then(err => {
        if (err) {
          throw 500
        } else {
          return true
        }
      })

  } else {
    throw 400
  }
}

exports.deleteEntry = function(id) {
  const [ i ] = findEntry(id)

  if (i !== null) {
    const removed = entries.splice(i, 1)[0]

    entriesStore.removed.push(removed)

    return writeEntries()
      .then(err => {
        if (err) {
          throw 500
        } else {
          return true
        }
      })

  } else {
    throw 400
  }
}
