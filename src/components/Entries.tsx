import { EntryType } from '../types'
import Entry from './Entry'
import * as styles from '../styles/Entries.module.css'

export default function Entries({
  entries,
  onEdit,
  onRemove
}: {
  entries: EntryType[],
  onEdit: (entry: EntryType) => void,
  onRemove: (id: number) => void
}) {
  const entriesElements = entries.map(entry =>
    <Entry {...entry} key={entry.id} onEdit={onEdit} onRemove={onRemove} />)

  return (
    <>
      <div className={styles.entriesCount}>
        {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
      </div>
      <div>{entriesElements}</div>
    </>
  )
}
