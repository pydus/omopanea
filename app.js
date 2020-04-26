const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const entries = require('./server/entries.json')

app.use(express.static('src'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')))

app.get('/entries', (req, res) => res.json(entries))

app.listen(port)