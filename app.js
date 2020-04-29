const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const entriesStore = require('./store/entries.json')
const entries = entriesStore.data

app.use(express.static('src'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')))

app.use(express.json())

function writeEntries() {
  const newEntriesStoreString = JSON.stringify(entriesStore)

  return new Promise(resolve =>
    fs.writeFile('store/entries.json', newEntriesStoreString, err => {
      resolve(err)
    }))
}

function findEntry(id) {
  for (const [ i, entry ] of entries.entries()) {
    if (entries[i].id === Number(id)) {
      return [ i, entry ]
    }
  }

  return [ null, null ]
}

app.get('/entries', (req, res) => res.json(entries))

app.post('/entries', (req, res) => {
  const newEntry = req.body

  newEntry.id = entriesStore.nextId++

  entries.push(req.body)

  writeEntries().then(err => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.json({ id: newEntry.id })
    }
  })
})

app.put('/entries', (req, res) => {
  const entry = req.body

  const [ i ] = findEntry(entry.id)

  if (i !== null) {
    entry.dateEdited = Date.now()

    entries[i] = entry

    writeEntries().then(err => {
      if (err) {
        res.sendStatus(500)
      } else {
        res.sendStatus(200)
      }
    })
  } else {
    res.sendStatus(400)
  }
})

app.delete('/entries', (req, res) => {
  const [ i ] = findEntry(req.body.id)

  if (i !== null) {
    const removed = entries.splice(i, 1)[0]

    entriesStore.removed.push(removed)

    writeEntries().then(err => {
      if (err) {
        res.sendStatus(500)
      } else {
        res.sendStatus(200)
      }
    })
  } else {
    res.sendStatus(400)
  }
})

app.listen(port)