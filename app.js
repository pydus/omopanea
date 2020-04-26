const path = require('path')
const express = require('express')
const app = express()
const port = 3000

const state = require('./server/state.json')

app.use(express.static('src'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')))

app.get('/state', (req, res) => res.json(state))

app.listen(port)