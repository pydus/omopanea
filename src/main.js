let state = null

async function fetchState() {
  return fetch('/state')
    .then(response => response.json())
}

function updateState() {
  fetchState().then(s => state = s)
}

updateState()
