import { getTags, arraysAreEqual } from '../util'
import * as styles from '../styles/Tags.module.css'

export default function Tags({
  tags,
  onChange,
  onBlur
}: {
  tags: string[],
  onChange: (tags: string[]) => void,
  onBlur: () => void
}) {
  function editTags(event) {
    const tagsString = event.target.innerText
    const newTags = getTags(tagsString)

    if (!arraysAreEqual(tags, newTags)) {
      onChange(newTags)
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <div
      className={styles.tags}
      onKeyDown={onKeyDown}
      onKeyUp={editTags}
      onBlur={onBlur}
      suppressContentEditableWarning={true}
      contentEditable>
        {tags.join(', ')}
    </div>
  )
}
