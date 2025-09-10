import { useRef } from 'react'
import { editEntry, removeEntry } from '../api'
import MenuButton from './MenuButton'
import DateView from './DateView'
import Tags from './Tags'
import { EntryType } from '../types'
import * as styles from '../styles/Entry.module.css'

export default function Entry({
  id,
  tags,
  content,
  dateCreated,
  dateEdited,
  filterTags,
  onEdit,
  onRemove
}: {
  id: number,
  tags: string[],
  content: string,
  dateCreated: number,
  dateEdited: number,
  filterTags: string[],
  onEdit: (entry: EntryType) => void,
  onRemove: (id: number) => void
}) {
  const pendingEntry = useRef<EntryType | null>(null)

  function reportChanges() {
    if (pendingEntry.current) {
      onEdit({ ...pendingEntry.current })
      pendingEntry.current = null
    }
  }

  function editContent(event) {
    const newContent = event.target.innerHTML

    const newEntry = {
      id,
      tags: pendingEntry.current?.tags ?? tags,
      content: newContent,
      dateCreated,
      dateEdited: Date.now()
    }

    editEntry(newEntry)
    pendingEntry.current = newEntry
  }

  function editTags(newTags: string[]) {
    const newEntry = {
      id,
      tags: newTags,
      content: pendingEntry.current?.content ?? content,
      dateCreated,
      dateEdited: Date.now()
    }

    editEntry(newEntry)
    pendingEntry.current = newEntry
  }

  function remove() {
    removeEntry(id)
      .then(response => {
        if (response.status === 200) {
          onRemove(id)
        }
      })
  }

  return (
    <div className={styles.entry}>
      <div className={styles.title}>
        {filterTags.length === 0
          && <DateView dateCreated={dateCreated} dateEdited={dateEdited} />}
        <Tags
          tags={tags}
          filterTags={filterTags}
          onChange={editTags}
          onBlur={reportChanges} />
        <MenuButton name="Remove" onClick={remove} />
      </div>
      <div
        className={styles.content}
        onInput={editContent}
        onBlur={reportChanges}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressContentEditableWarning={true}
        contentEditable={true}>
      </div>
    </div>
  )
}
