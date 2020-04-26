async function fetchJSON(url) {
  return fetch(url)
    .then(response => response.json())
}

function Entry(tags, content) {
  return {
    tags,
    content,
    dateCreated: Date.now(),
    dateEdited: null
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

function list(element, entries) {
  for (const entry of entries) {
    element.innerHTML += EntryView(entry)
  }
}

fetchJSON('/state').then(state =>
  list(document.getElementById('entries'), state.entries))
