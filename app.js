const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const entriesStore = require('./store/entries.json')
const entries = entriesStore.data

app.use(express.static('src'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')))

app.get('/entries', (req, res) => res.json(entries))

app.use(express.json())

app.post('/entries', (req, res) => {
  const newEntry = req.body

  newEntry.id = entriesStore.nextId++

  entries.push(req.body)

  const newEntriesStoreString = JSON.stringify(entriesStore)

  fs.writeFile('store/entries.json', newEntriesStoreString, err => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
})

app.listen(port)