import { EntryType } from '../types'
import Entry from './Entry'
import * as styles from '../styles/Entries.module.css'

export default function Entries({
  entries,
  filterTags,
  onEdit,
  onRemove
}: {
  entries: EntryType[],
  filterTags: string[],
  onEdit: (entry: EntryType) => void,
  onRemove: (id: number) => void
}) {
  const entriesElements = entries
    .sort((a, b) => b.dateEdited - a.dateEdited)
    .map(entry =>
      <Entry
        {...entry}
        key={entry.id}
        filterTags={filterTags}
        onEdit={onEdit}
        onRemove={onRemove} />)

  return (
    <>
      <div className={styles.entriesCount}>
        {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
      </div>
      <div>{entriesElements}</div>
    </>
  )
}
