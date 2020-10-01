const {
  addEntry,
  editEntry,
  deleteEntry,
  getEntries
} = require('./store/entries.js')

module.exports = function(app) {
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
}