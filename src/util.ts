export function arraysAreEqual(a: any[], b: any[]) {
  if (a.length !== b.length) {
    return false
  }

  for (const [ i, element ] of a.entries()) {
    if (element !== b[i]) {
      return false
    }
  }

  return true
}

export function getTags(tagsString: string) {
  return tagsString === '' ?
    [] : tagsString
      .toLowerCase()
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
}
