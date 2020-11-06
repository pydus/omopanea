/**
 * Checks for equality between two variables with any type.
 * @param {*} x 
 * @param {*} y 
 */

function areEqual(x, y) {
  if (Array.isArray(x)) {
    if (!Array.isArray(y) || !arraysAreEqual(x, y)) {
      return false
    }
  } else if (typeof x === 'object' && x !== null) {
    if (typeof y !== 'object' || y === null ||
        Array.isArray(y) || !objectsAreEqual(x, y)) {
      return false
    }
  } else if (x !== y) {
    return false
  }

  return true
}

exports.areEqual = areEqual

function arraysAreEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false
  }

  for (let i = 0; i < array1.length; i++) {
    if (!areEqual(array1[i], array2[i])) {
      return false
    }
  }

  return true
}

function objectsAreEqual(object1, object2, hasRunOnce = false) {
  for (const key in object1) {
    if (!object2.hasOwnProperty(key)) {
      return false
    }

    if (!areEqual(object1[key], object2[key])) {
      return false
    }
  }

  return hasRunOnce ? true : objectsAreEqual(object2, object1, true)
}
