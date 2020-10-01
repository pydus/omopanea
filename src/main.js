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
        ? ` (edited ${getDateTimeString(dateEdited)})`
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

function addEntry(element, entry) {
  element.innerHTML = EntryView(entry) + element.innerHTML
}

function addEntries(element, entries) {
  for (const entry of entries) {
    addEntry(element, entry)
  }
}

function displayEntries(entriesElement, entries) {
  entriesElement.innerHTML = ''
  addEntries(entriesElement, entries)
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
  return fetch('/entries', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

function removeEntry(tagsElement, entriesElement, id, entries) {
  return fetch('/entries', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  }).then(response => {
    if (response.status === 200) {
      const i = findIndex(id, entries)

      if (i !== -1) {
        entries.splice(i, 1)
        updateEntries(tagsElement, entriesElement, entries)
      }
    }
  })
}

function getTags(tagsElement) {
  return tagsElement.value === '' ?
    [] : tagsElement.value
      .toLowerCase()
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
}

function addContentElementListeners(tagsElement, contentElement, entriesElement, entries) {
  let controlIsDown = false

  contentElement.addEventListener('keydown', e => {
    if (e.key === 'Control') {
      controlIsDown = true
    } else if (e.key === 'Enter' && controlIsDown) {
      const tags = getTags(tagsElement)
      const content = contentElement.value
      const entry = Entry(tags, content)

      entries.push(entry)

      addEntry(entriesElement, entry)

      postEntry(entry)
        .then(response => response.json())
        .then(data => entry.id = data.id)
        .then(() => updateEntries(tagsElement, entriesElement, entries))

      contentElement.value = ''
    }
  })

  contentElement.addEventListener('keyup', e => {
    if (e.key === 'Control') {
      controlIsDown = false
    }
  })
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
  const tags = getTags(tagsElement)
  const filteredEntries = tagFilter(tags, entries)
  displayEntries(entriesElement, filteredEntries)
}

function addTagsElementListeners(tagsElement, entriesElement, entries) {
  tagsElement.addEventListener('keyup', () => {
    displayFilteredEntries(tagsElement, entriesElement, entries)
  })
}

function addEntriesListeners(entriesElement, entries) {
  entriesElement.addEventListener('keyup', e => {
    if (e.target.className === 'content') {
      const id = e.target.parentNode.id
      const newContent = e.target.innerHTML
      const entry = findEntry(id, entries)

      if (newContent !== entry.content) {
        entry.content = newContent
  
        editEntry(entry)
        
        const dateElement = document.getElementById(`date-${id}`)
  
        dateElement.innerHTML = DateView(entry.dateCreated, Date.now())
      }
    }
  })
}

function addMouseListeners(tagsElement, entriesElement, entries, removeClassName) {
  addEventListener('mouseup', e => {
    if (e.target.className === removeClassName) {
      const id = e.target.parentNode.parentNode.parentNode.parentNode.id

      removeEntry(tagsElement, entriesElement, id, entries)
    }
  })
}

function start(tagsElement, contentElement, entriesElement) {
  fetchJSON('/entries')
    .then(entries => {
      updateEntries(tagsElement, entriesElement, entries)
      addContentElementListeners(tagsElement, contentElement, entriesElement, entries)
      addTagsElementListeners(tagsElement, entriesElement, entries)
      addEntriesListeners(entriesElement, entries)
      addMouseListeners(tagsElement, entriesElement, entries, 'remove')
    })
}

start(
  document.getElementById('tags'),
  document.getElementById('content'),
  document.getElementById('entries')
)
