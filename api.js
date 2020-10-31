const {
  addEntry,
  editEntry,
  deleteEntry,
  getEntries
} = require('./store/entries.js')

function tryAndSendStatusOnFail(res, callback) {
  try {
    callback()
  } catch (err) {
    if (typeof err === 'number') {
      res.sendStatus(err)
    } else {
      res.sendStatus(500)
    }
  }
}

module.exports = function(app) {
  app.get('/entries', (req, res) =>
    res.json(getEntries()))

  app.post('/entries', (req, res) => {
    tryAndSendStatusOnFail(res, () => {
      const newEntry = req.body

      addEntry(newEntry)
        .then(id => res.json({ id }))
    })
  })

  app.put('/entries/:id', (req, res) => {
    tryAndSendStatusOnFail(res, () => {
      const id = req.params.id
      const entry = req.body

      entry.id = id

      editEntry(entry)
        .then(() => res.sendStatus(200))
    })
  })

  app.delete('/entries/:id', (req, res) => {
    tryAndSendStatusOnFail(res, () => {
      deleteEntry(req.params.id)
        .then(() => res.sendStatus(200))
    })
  })
}
