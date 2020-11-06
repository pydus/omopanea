const fs = require('fs')
const { matchesModel, copyUneditable } = require('./util')
const entriesStore = require('./entries.json')
const entryModel = require('./entry.json')

function writeEntries(store = entriesStore) {
  const newEntriesStoreString = JSON.stringify(store)

  return new Promise(resolve =>
    fs.writeFile('store/entries.json',
      newEntriesStoreString, err => resolve(err)))
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
  const entryIsValid = matchesModel(entryModel, newEntry)

  if (entryIsValid) {
    const now = Date.now()

    newEntry.id = store.nextId++

    newEntry.dateCreated = now
    newEntry.dateEdited = now

    entries.push(newEntry)

    return writeEntries(store)
      .then(err => {
        if (err) {
          throw 500
        } else {
          return newEntry.id
        }
      })

  } else {
    throw 400
  }
}

exports.editEntry = function(entry, store = entriesStore) {
  const entries = store.data
  const [ i, storedEntry ] = findEntry(entry.id, entries)
  const entryIsValid = matchesModel(entryModel, entry)

  if (i !== null && entryIsValid) {
    const newEntry = copyUneditable(entryModel, storedEntry, entry)

    newEntry.dateEdited = Date.now()

    entries[i] = newEntry

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
