import { useState, useEffect, useRef } from 'react'
import { getEntries } from '../api'
import { EntryType } from '../types'
import EntryInput from './EntryInput'
import Entries from './Entries'
import '../styles/style.css'

export default function App() {
  const [ tags, setTags ] = useState<string[]>([])
  const [ entries, setEntries ] = useState<EntryType[]>([])
  const pendingEntries = useRef<EntryType[]>([])

  useEffect(() => {
    getEntries().then(entries => setEntries(entries.reverse()))
  }, [])

  function addEntry(entry: EntryType) {
    setEntries([ entry, ...entries ])
  }

  function removeEntry(id: number) {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  function filterEntries(entries: EntryType[], tags: string[]) {
    const hiddenEntryTagPrefix = '.'

    if (tags.length < 1) {
      return entries.filter(entry =>
        !entry.tags.find(tag => tag[0] === hiddenEntryTagPrefix))
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

  function applyChanges() {
    setEntries(entries.map(entry => pendingEntries.current.find(
      pendingEntry => pendingEntry.id === entry.id) ?? entry))
    pendingEntries.current = []
  }

  function addPendingEntry(entry: EntryType) {
    pendingEntries.current = pendingEntries.current.filter(
      pendingEntry => pendingEntry.id !== entry.id)
    pendingEntries.current.push(entry)
  }

  function onNewTags(newTags: string[]) {
    setTags(newTags)
    applyChanges()
  }

  return (
    <>
      <EntryInput onNewEntry={addEntry} onNewTags={onNewTags} />
      <Entries
        entries={filterEntries(entries, tags)}
        filterTags={tags}
        onEdit={addPendingEntry}
        onRemove={removeEntry} />
    </>
  )
}
