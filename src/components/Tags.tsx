import { arraysAreEqual, getTags } from '../util'
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
  const [ visibleTags, setVisibleTags ] = useState(tags)
  const [ focused, setFocused ] = useState(false)
  const [ tagsString, setTagsString ] = useState<string | null>(null)
  const inputRef = useRef(null)

  function editTags(event) {
    const tagsString = event.target.innerText
    const newTags = getTags(tagsString)
    onChange(newTags)
  }

  function onKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  function onFocus(event) {
    const tagsString = event.target.innerText
    setTagsString(tagsString)
    setFocused(true)
  }

  function _onBlur(event) {
    const newTagsString = event.target.innerText
    const newTags = getTags(newTagsString)

    if (arraysAreEqual(newTags, visibleTags)) {
      event.target.innerText = tagsString
    }

    setVisibleTags(newTags)
    setTagsString(null)
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
          && filterTags.filter(tag => visibleTags.includes(tag)).join(', ') + ' '}
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
            ? visibleTags.join(', ')
              : (visibleTags.length > 0
                ? visibleTags.filter(tag => !filterTags.includes(tag)).join(', ')
                  : ' ')}
      </div>
    </>
  )
}
