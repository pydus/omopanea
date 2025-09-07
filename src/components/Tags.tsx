import { getTags, arraysAreEqual } from '../util'
import * as styles from '../styles/Tags.module.css'
import { useRef, useState } from 'react'

export default function Tags({
  tags,
  filterTags,
  onChange,
  onBlur
}: {
  tags: string[],
  filterTags: string[],
  onChange: (tags: string[]) => void,
  onBlur: () => void
}) {
  const [ focused, setFocused ] = useState(false)
  const inputRef = useRef(null)

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

  function onFocus() {
    setFocused(true)
  }

  function _onBlur() {
    setFocused(false)
    onBlur()
  }

  function onFilterTagClick() {
    inputRef.current.focus()
  }

  return (
    <>
      <div className={styles.filterTags} onClick={onFilterTagClick}>
        {!focused
          && filterTags.filter(tag => tags.includes(tag)).join(', ') + ' '}
      </div>
      <div
        ref={inputRef}
        className={styles.tags}
        onKeyDown={onKeyDown}
        onInput={editTags}
        onFocus={onFocus}
        onBlur={_onBlur}
        suppressContentEditableWarning={true}
        contentEditable={true}>
          {focused
            ? tags.join(', ')
              : (tags.length > 0
                ? tags.filter(tag => !filterTags.includes(tag)).join(', ')
                  : ' ')}
      </div>
    </>
  )
}
