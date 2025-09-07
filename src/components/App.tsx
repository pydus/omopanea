import { useState, useEffect } from 'react'
import { getEntries } from '../api'
import { EntryType } from '../types'
import EntryInput from './EntryInput'
import Entries from './Entries'
import '../styles/style.css'

export default function App() {
  const [ tags, setTags ] = useState<string[]>([])
  const [ entries, setEntries ] = useState<EntryType[]>([])

  useEffect(() => {
    getEntries().then(entries => setEntries(entries.reverse()))
  }, [])

  function addEntry(entry: EntryType) {
    setEntries([ entry, ...entries ])
  }

  function editEntry(newEntry: EntryType) {
    setEntries(entries.map(entry =>
      entry.id === newEntry.id ? newEntry : entry))
  }

  function removeEntry(id: number) {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  function filterEntries(entries: EntryType[], tags: string[]) {
    if (tags.length < 1) {
      return entries
    }

    return entries.filter(entry => {
      for (const tag of tags) {
        if (!entry.tags.includes(tag)) {
          return false
        }
      }

      return true
    })
  }

  return (
    <>
      <EntryInput onNewEntry={addEntry} onNewTags={setTags} />
      <Entries
        entries={filterEntries(entries, tags)}
        filterTags={tags}
        onEdit={editEntry}
        onRemove={removeEntry} />
    </>
  )
}
