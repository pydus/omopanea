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
    tags,
    content,
    dateCreated: Date.now(),
    dateEdited: Date.now()
  }
}

function getDateTimeString(date) {
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

function EntryView(entry) {
  return `
    <div class="entry">
      <div class="date">${getDateTimeString(new Date(entry.dateEdited))}</div>
      <div class="tags" contenteditable>${entry.tags.join(', ')}</div>
      <div class="content" contenteditable>${entry.content}</div>
    </div>
  `
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
  fetch('/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
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

function init() {
  addContentElementListeners()
  addTagsElementListeners()
  fetchJSON('/entries').then(newEntries => updateEntries(newEntries))
}

init()
