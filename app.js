const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const {
  addEntry,
  editEntry,
  deleteEntry,
  getEntries
} = require('./store/entries.js')

app.use(express.static('src'))

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'index.html')))

app.use(express.json())

app.get('/entries', (req, res) =>
  res.json(getEntries()))

app.post('/entries', (req, res) => {
  try {
    const newEntry = req.body

    addEntry(newEntry)
      .then(id => res.json({ id }))

  } catch (err) {
    res.sendStatus(err)
  }
})

app.put('/entries', (req, res) => {
  try {
    const entry = req.body

    editEntry(entry)
      .then(() => res.sendStatus(200))

  } catch (err) {
    res.sendStatus(err)
  }
})

app.delete('/entries', (req, res) => {
  try {

    deleteEntry(req.body.id)
      .then(() => res.sendStatus(200))

  } catch (err) {
    res.sendStatus(err)
  }
})

app.listen(port)
