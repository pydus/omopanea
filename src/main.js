const tagsElement = document.getElementById('tags')
const contentElement = document.getElementById('content')
const entriesElement = document.getElementById('entries')

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

function EntryView(entry) {
  return `
    <div class="entry">
      <div class="date">${(new Date(entry.dateEdited)).toDateString()}</div>
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

function postEntry(entry) {
  fetch('/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

function addContentElementListeners() {
  let controlIsDown = false

  contentElement.addEventListener('keydown', e => {
    if (e.key === 'Control') {
      controlIsDown = true
    } else if (e.key === 'Enter' && controlIsDown) {
      const tags = tagsElement.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const content = contentElement.value

      if (content.length > 0) {
        const entry = Entry(tags, content)
        addEntry(entriesElement, entry)
        postEntry(entry)
        contentElement.value = ''
      }
    }
  })

  contentElement.addEventListener('keyup', e => {
    if (e.key === 'Control') {
      controlIsDown = false
    }
  })
}

addContentElementListeners()

fetchJSON('/entries').then(entries =>
  addEntries(entriesElement, entries))
