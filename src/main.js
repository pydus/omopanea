const tagsElement = document.getElementById('tags')
const contentElement = document.getElementById('content')
const entriesElement = document.getElementById('entries')

let entries = []

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
      <span id="date-${entry.id}">${DateView(entry.dateCreated, entry.dateEdited)}</span>
      <div class="tags" contenteditable>${entry.tags.join(', ')}</div>
      <div class="menu-button"><ul><li class="remove">Remove</li></ul></div>
      <div class="content" contenteditable>${entry.content}</div>
    </div>
  `
}

function findEntry(id) {
  for (const entry of entries) {
    if (entry.id === Number(id)) {
      return entry
    }
  }
}

function findIndex(id) {
  for (const [ i, entry ] of entries.entries()) {
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

function displayEntries(entries) {
  entriesElement.innerHTML = ''
  addEntries(entriesElement, entries)
}

function updateEntries(newEntries) {
  entries = newEntries
  entriesElement.innerHTML = ''
  displayFilteredEntries(entries)
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

function removeEntry(id) {
  return fetch('/entries', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  }).then(response => {
    if (response.status === 200) {
      const i = findIndex(id)

      if (i !== -1) {
        entries.splice(i, 1)
        updateEntries(entries)
      }
    }
  })
}

function getTags() {
  return tagsElement.value === '' ?
    [] : tagsElement.value
      .toLowerCase()
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
}

function addContentElementListeners() {
  let controlIsDown = false

  contentElement.addEventListener('keydown', e => {
    if (e.key === 'Control') {
      controlIsDown = true
    } else if (e.key === 'Enter' && controlIsDown) {
      const tags = getTags()
      const content = contentElement.value
      const entry = Entry(tags, content)

      entries.push(entry)

      addEntry(entriesElement, entry)

      postEntry(entry)
        .then(response => response.json())
        .then(data => entry.id = data.id)
        .then(() => updateEntries(entries))

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

function displayFilteredEntries(entries) {
  const tags = getTags()
  const filteredEntries = tagFilter(tags, entries)
  displayEntries(filteredEntries)
}

function addTagsElementListeners() {
  tagsElement.addEventListener('keyup', () => {
    displayFilteredEntries(entries)
  })
}

function addEntriesListeners() {
  const entriesElement = document.getElementById('entries')

  entriesElement.addEventListener('keyup', e => {
    if (e.target.className === 'content') {
      const id = e.target.parentNode.id
      const newContent = e.target.innerHTML
      const entry = findEntry(id)

      if (newContent !== entry.content) {
        entry.content = newContent
  
        editEntry(entry)
        
        const dateElement = document.getElementById(`date-${id}`)
  
        dateElement.innerHTML = DateView(entry.dateCreated, Date.now())
      }
    }
  })
}

function addMouseListeners() {
  addEventListener('mouseup', e => {
    if (e.target.className === 'remove') {
      const id = e.target.parentNode.parentNode.parentNode.id

      removeEntry(id)
    }
  })
}

function init() {
  addContentElementListeners()
  addTagsElementListeners()
  addEntriesListeners()
  addMouseListeners()

  fetchJSON('/entries').then(updateEntries)
}

init()
