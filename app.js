const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const entries = require('./server/entries.json')

app.use(express.static('src'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')))

app.get('/entries', (req, res) => res.json(entries))

app.use(express.json())

app.post('/entries', (req, res) => {
  entries.push(req.body)

  fs.writeFile('server/entries.json', JSON.stringify(entries), err => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
})

app.listen(port)