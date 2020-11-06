
 /**
  * Checks if all keys that do not have null values in
  * model exist in object
  * @param {object} model 
  * @param {object} object 
  */

function keysMatchModel(model, object) {
  for (const key in model) {
    if (model[key] !== null && !(key in object)) {
      return false
    }
  }

  for (const key in object) {
    if (!(key in model)) {
      return false
    }
  }

  return true
}

exports.keysMatchModel = keysMatchModel

/**
 * Checks if all values in object have the same type
 * as the value with the same key in model excluding
 * keys with null values
 * @param {object} model 
 * @param {object} object 
 */

function typesMatchModel(model, object) {
  for (const key in object) {
    if (key in model && model[key] !== null) {
      if (typeof object[key] !== typeof model[key]) {
        return false
      }
    }
  }

  return true
}

exports.typesMatchModel = typesMatchModel

/**
 * Checks if all object keys exist in model and the
 * corresponding values have the correct type
 * specified in model
 * @param {object} model 
 * @param {object} object 
 */

exports.matchesModel = function(model, object) {
  return keysMatchModel(model, object) &&
    typesMatchModel(model, object)
}

/**
 * Returns new object without all properties whose keys
 * map to null values in model
 * @param {object} model 
 * @param {object} object 
 */

exports.stripUneditable = function(model, object) {
  const newObject = {}

  for (const key in object) {
    if (!(key in model) || model[key] !== null) {
      newObject[key] = object[key]
    }
  }

  return newObject
}

/**
 * Returns new destination object with all values with keys
 * that map to null in model replaced with those from source
 * @param {object} model 
 * @param {object} source 
 * @param {object} destination 
 */

exports.copyUneditable = function(model, source, destination) {
  const newObject = { ...destination }

  for (const key in model) {
    if (model[key] === null && key in source) {
      newObject[key] = source[key]
    }
  }

  return newObject
}
