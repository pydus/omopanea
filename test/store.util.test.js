const { test, expect } = require('../tester')
const entryModel = require('../store/entry.json')

const {
  keysMatchModel,
  typesMatchModel,
  matchesModel,
  stripUneditable,
  copyUneditable
} = require('../store/util.js')

const entry = {
  id: 99,
  tags: ['tag1'],
  content: 'text'
}

const allUneditable = {
  id: 0,
  dateCreated: 0,
  dateEdited: 0
}

/**
 * keysMatchModel
 */

test('keysMatchModel all keys', () =>
  expect(
      keysMatchModel(entryModel, entry))
    .toBe(true))

test('keysMatchModel missing key', () =>
  expect(
      keysMatchModel(entryModel, { content: '' }))
    .toBe(false))

test('matchesModel extra key', () =>
  expect(
      keysMatchModel(entryModel, {
      ...entry, hello: 0 }))
    .toBe(false))

test('keysMatchModel all uneditable', () =>
  expect(
      keysMatchModel(entryModel, allUneditable))
    .toBe(false))

/**
 * typesMatchModel
 */

test('typesMatchModel', () =>
  expect(typesMatchModel(entryModel, entry))
    .toBe(true))

test('typesMatchModel wrong type', () =>
  expect(
      typesMatchModel(entryModel, {
      content: '', tags: 0 }))
    .toBe(false))

/**
 * matchesModel
 */

test('matchesModel', () =>
  expect(matchesModel(entryModel, entry))
    .toBe(true))

test('matchesModel wrong type', () =>
  expect(matchesModel(entryModel, {
      content: 0, tags: [] }))
    .toBe(false))

test('matchesModel missing key', () =>
  expect(matchesModel(entryModel, { tags: ['tag1'] }))
    .toBe(false))

test('matchesModel extra key', () =>
  expect(matchesModel(entryModel, {
      ...entry, hello: '' }))
    .toBe(false))

test('matchesModel all uneditable', () =>
  expect(matchesModel(entryModel, allUneditable))
    .toBe(false))

/**
 * stripUneditable
 */

test('stripUneditable', () =>
  expect(
      stripUneditable(entryModel, entry))
    .toEqual({ tags: ['tag1'], content: 'text' }))

/**
 * copyUneditable
 */

test('copyUneditable', () =>
  expect(
      copyUneditable(
        entryModel,
        { id: 5, tags: [], content: '1', dateCreated: 10, dateEdited: 15 },
        { id: 93, tags: ['tag'], content: '2', dateCreated: 10 }))
    .toEqual({
      id: 5, tags: ['tag'], content: '2', dateCreated: 10, dateEdited: 15 }))
