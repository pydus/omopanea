async function fetchJSON(url) {
  return fetch(url)
    .then(response => response.json())
}

function Entry(tags, content) {
  return {
    id: null,
    tags,
    content,
    dateCreated: Date.now(),
    dateEdited: Date.now()
  }
}

function getDateTimeString(time) {
  const date = new Date(time)
  let dateString = date.toDateString()
  const otherDate = new Date(Date.now())

  if (dateString === otherDate.toDateString()) {
    dateString = 'Today'
  }

  otherDate.setDate(otherDate.getDate() - 1)

  if (dateString === otherDate.toDateString()) {
    dateString = 'Yesterday'
  }

  const timeString = date.toTimeString().slice(0, 5)

  return `${dateString} ${timeString}`
}

function DateView(dateCreated, dateEdited) {
  return `
    <div class="date">
      ${getDateTimeString(dateCreated)}
      ${dateEdited !== dateCreated
        ? `<span title="Edited ${getDateTimeString(dateEdited)}">*</span>`
          : ''}
    </div>
  `
}

function EntryView(entry) {
  return `
    <div class="entry" id="${entry.id}">
      <div class="title">
        <span id="date-${entry.id}">${DateView(entry.dateCreated, entry.dateEdited)}</span>
        <div class="tags" contenteditable>${entry.tags.join(', ')}</div>
        <div class="menu-button"><ul><li class="remove">Remove</li></ul></div>
      </div>
      <div class="content" contenteditable>${entry.content}</div>
    </div>
  `
}

function findEntry(id, entries) {
  for (const entry of entries) {
    if (entry.id === Number(id)) {
      return entry
    }
  }
}

function findIndex(id, array) {
  for (const [ i, entry ] of array.entries()) {
    if (entry.id === Number(id)) {
      return i
    }
  }

  return -1
}

function addEntryToElement(element, entry) {
  element.innerHTML = EntryView(entry) + element.innerHTML
}

function addEntriesToElement(element, entries) {
  for (const entry of entries) {
    addEntryToElement(element, entry)
  }
}

function displayEntries(entriesElement, entries) {
  entriesElement.innerHTML = ''
  addEntriesToElement(entriesElement, entries)
}

function updateEntries(tagsElement, entriesElement, newEntries) {
  entriesElement.innerHTML = ''
  displayFilteredEntries(tagsElement, entriesElement, newEntries)
}

function postEntry(entry) {
  return fetch('/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

function editEntry(entry) {
  return fetch(`/entries/${entry.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

function removeEntry(id) {
  return fetch(`/entries/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function removeEntryLocally(id, entries) {
  const i = findIndex(id, entries)

  if (i !== -1) {
    const newEntries = [
      ...entries.slice(0, i),
      ...entries.slice(i + 1)
    ]

    return newEntries
  }
}

function getTags(tagsString) {
  return tagsString === '' ?
    [] : tagsString
      .toLowerCase()
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
}

function addContentElementListeners(tagsElement, contentElement, entries, callback) {
  let controlIsDown = false

  function onKeyDown(e) {
    if (e.key === 'Control') {
      controlIsDown = true
    } else if (e.key === 'Enter' && controlIsDown) {
      const tags = getTags(tagsElement.value)
      const content = contentElement.value
      const entry = Entry(tags, content)
      const newEntries = [ ...entries, entry ]

      postEntry(entry)
        .then(response => response.json())
        .then(data => entry.id = data.id)
        .then(() => callback(newEntries))

      contentElement.value = ''
    }
  }

  function onKeyUp(e) {
    if (e.key === 'Control') {
      controlIsDown = false
    }
  }

  contentElement.addEventListener('keydown', onKeyDown)
  contentElement.addEventListener('keyup', onKeyUp)

  return () => {
    contentElement.removeEventListener('keydown', onKeyDown)
    contentElement.removeEventListener('keyup', onKeyUp)
  }
}

function tagFilter(tags, entries) {
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

function displayFilteredEntries(tagsElement, entriesElement, entries) {
  const tags = getTags(tagsElement.value)
  const filteredEntries = tagFilter(tags, entries)
  displayEntries(entriesElement, filteredEntries)
}

function addTagsElementListeners(tagsElement, entriesElement, entries) {
  function onKeyUp(e) {
    displayFilteredEntries(tagsElement, entriesElement, entries)
  }

  tagsElement.addEventListener('keyup', onKeyUp)

  return () => tagsElement.removeEventListener('keyup', onKeyUp)
}

function updateEntryDateEdited(entry, dateEdited) {
  const dateElement = document.getElementById(`date-${entry.id}`)
  dateElement.innerHTML = DateView(entry.dateCreated, dateEdited)
}

function addEntriesListeners(entriesElement, entries) {
  function onKeyUp(e) {
    if (e.target.className === 'content') {
      const id = e.target.parentNode.id
      const newContent = e.target.innerHTML
      const entry = findEntry(id, entries)

      if (newContent !== entry.content) {
        entry.content = newContent

        editEntry(entry)

        const dateEdited = Date.now()

        updateEntryDateEdited(entry, dateEdited)
      }
    }
  }

  entriesElement.addEventListener('keyup', onKeyUp)

  return () => entriesElement.removeEventListener('keyup', onKeyUp)
}

function addMouseListeners(entries, removeClassName, callback) {
  function onMouse(e) {
    if (e.target.className === removeClassName) {
      const id = e.target.parentNode.parentNode.parentNode.parentNode.id

      removeEntry(id)
        .then(response => {
          if (response.status === 200) {
            const newEntries = removeEntryLocally(id, entries)

            if (newEntries) {
              callback(newEntries)
            }
          }
        })
    }
  }

  addEventListener('mouseup', onMouse)

  return () => removeEventListener('mouseup', onMouse)
}

function start(tagsElement, contentElement, entriesElement) {
  fetchJSON('/entries')
    .then(function load(entries) {
      updateEntries(tagsElement, entriesElement, entries)

      const removeContentElementListeners =
        addContentElementListeners(tagsElement, contentElement, entries, reload)

      const removeTagsElementListeners =
        addTagsElementListeners(tagsElement, entriesElement, entries)

      const removeEntriesListeners = addEntriesListeners(entriesElement, entries)
      const removeMouseListeners = addMouseListeners(entries, 'remove', reload)

      function unload() {
        removeContentElementListeners()
        removeTagsElementListeners()
        removeEntriesListeners()
        removeMouseListeners()
      }

      function reload(entries) {
        unload()
        load(entries)
      }
    })
}

start(
  document.getElementById('tags'),
  document.getElementById('content'),
  document.getElementById('entries')
)
