const path = require('path')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('dist'))

app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html')))

app.use(express.json())

require('./api')(app)

app.listen(port)
