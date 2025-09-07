import { EntryType, Endpoint } from './types'

async function fetchJSON(url: Endpoint) {
  return fetch(url)
    .then(response => response.json())
}

export function getEntries() {
  return fetchJSON('/entries')
}

export function postEntry(entry: EntryType) {
  return fetch('/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

export function editEntry(entry: EntryType) {
  return fetch(`/entries/${entry.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

export function removeEntry(id: number) {
  return fetch(`/entries/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
