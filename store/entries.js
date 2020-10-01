const fs = require('fs')
const entriesStore = require('./entries.json')

function writeEntries(store = entriesStore) {
  const newEntriesStoreString = JSON.stringify(store)

  return new Promise(resolve =>
    fs.writeFile('store/entries.json', newEntriesStoreString, err =>
      resolve(err)
    ))
}

function findEntry(id, entries = entriesStore.data) {
  for (const [ i, entry ] of entries.entries()) {
    if (entries[i].id === Number(id)) {
      return [ i, entry ]
    }
  }

  return [ null, null ]
}

exports.findEntry = findEntry

exports.getEntries = function() {
  return entriesStore.data
}

exports.addEntry = function(newEntry, store = entriesStore) {
  const entries = store.data

  newEntry.id = store.nextId++

  entries.push(newEntry)

  return writeEntries(store)
    .then(err => {
      if (err) {
        throw 500
      } else {
        return newEntry.id
      }
    })
}

exports.editEntry = function(entry, store = entriesStore) {
  const entries = store.data
  const [ i ] = findEntry(entry.id, entries)

  if (i !== null) {
    entry.dateEdited = Date.now()

    entries[i] = entry

    return writeEntries(store)
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

exports.deleteEntry = function(id, store = entriesStore) {
  const entries = store.data
  const [ i ] = findEntry(id, entries)

  if (i !== null) {
    const removed = entries.splice(i, 1)[0]

    store.removed.push(removed)

    return writeEntries(store)
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
