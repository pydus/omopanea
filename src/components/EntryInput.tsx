import { useState } from 'react'
import { postEntry } from '../api'
import { EntryType } from '../types'
import { getTags } from '../util'
import * as styles from '../styles/EntryInput.module.css'

export default function EntryInput({
  onNewEntry,
  onNewTags
}: {
  onNewEntry: (entry: EntryType) => void,
  onNewTags: (tags: string[]) => void
}) {
  const [ tags, setTags ] = useState<string[]>([])
  const [ controlIsDown, setControlIsDown ] = useState(false)

  function onKeyDown(event) {
    if (event.key === 'Control') {
      setControlIsDown(true)
    } else if (event.key === 'Enter' && controlIsDown) {
      const content = event.target.value

      const entry = {
        id: null,
        tags,
        content,
        dateCreated: Date.now(),
        dateEdited: Date.now()
      }

      postEntry(entry)
        .then(response => response.json())
        .then(data => entry.id = data.id)
        .then(() => onNewEntry(entry))

      event.target.value = ''
    }
  }

  function onKeyUp(event) {
    if (event.key === 'Control') {
      setControlIsDown(false)
    }
  }

  function updateTags(event) {
    const tagsString = event.target.value
    const newTags = getTags(tagsString)
    setTags(newTags)
    onNewTags(newTags)
  }

  return (
    <div className={styles.entryInput}>
      <input
        type="text"
        placeholder="tag1, tag2, ..."
        onChange={updateTags} />
      <textarea
        placeholder="content (ctrl+enter to post)"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}>
      </textarea>
    </div>
  )
}
