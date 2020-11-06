const { test, expect } = require('..')
const { areEqual } = require('../util')

/**
 * Basic values
 */

test('areEqual {} {}', () =>
  expect(areEqual({}, {})).toBe(true))

test('areEqual {} null', () =>
  expect(areEqual({}, null)).toBe(false))

test('areEqual null {}', () =>
  expect(areEqual(null, {})).toBe(false))

test('areEqual [] null', () =>
  expect(areEqual([], null)).toBe(false))

test('areEqual null []', () =>
  expect(areEqual(null, [])).toBe(false))

test('areEqual [] []', () =>
  expect(areEqual([], [])).toBe(true))

test('areEqual [] {}', () =>
  expect(areEqual([], {})).toBe(false))

test('areEqual {} []', () =>
  expect(areEqual({}, [])).toBe(false))

test('areEqual null null', () =>
  expect(areEqual(null, null)).toBe(true))

test('areEqual undefined undefined', () =>
  expect(areEqual(undefined, undefined)).toBe(true))

test('areEqual undefined null', () =>
  expect(areEqual(undefined, null)).toBe(false))

test('areEqual null undefined', () =>
  expect(areEqual(null, undefined)).toBe(false))

test('areEqual {} undefined', () =>
  expect(areEqual({}, undefined)).toBe(false))

test('areEqual undefined {}', () =>
  expect(areEqual(undefined, {})).toBe(false))

test('areEqual [] undefined', () =>
  expect(areEqual([], undefined)).toBe(false))

test('areEqual undefined []', () =>
  expect(areEqual(undefined, [])).toBe(false))

test('areEqual zeroes', () =>
  expect(areEqual(0, 0)).toBe(true))

test('areEqual numbers', () =>
  expect(areEqual(0, 1)).toBe(false))

test('areEqual empty strings', () =>
  expect(areEqual('', '')).toBe(true))

test('areEqual strings', () =>
  expect(areEqual('a', 'ab')).toBe(false))

test('areEqual empty string []', () =>
  expect(areEqual('', [])).toBe(false))

test('areEqual [] empty string', () =>
  expect(areEqual([], '')).toBe(false))

test('areEqual {} empty string', () =>
  expect(areEqual({}, '')).toBe(false))

test('areEqual empty string {}', () =>
  expect(areEqual('', {})).toBe(false))

test('areEqual {} false', () =>
  expect(areEqual({}, false)).toBe(false))

test('areEqual false {}', () =>
  expect(areEqual(false, {})).toBe(false))

test('areEqual {} true', () =>
  expect(areEqual({}, true)).toBe(false))

test('areEqual true {}', () =>
  expect(areEqual(true, {})).toBe(false))

test('areEqual true true', () =>
  expect(areEqual(true, true)).toBe(true))

test('areEqual false false', () =>
  expect(areEqual(false, false)).toBe(true))

test('areEqual true false', () =>
  expect(areEqual(true, false)).toBe(false))

test('areEqual false true', () =>
  expect(areEqual(false, true)).toBe(false))

test('areEqual false undefined', () =>
  expect(areEqual(false, undefined)).toBe(false))

test('areEqual undefined false', () =>
  expect(areEqual(undefined, false)).toBe(false))

test('areEqual true undefined', () =>
  expect(areEqual(true, undefined)).toBe(false))

test('areEqual undefined true', () =>
  expect(areEqual(undefined, true)).toBe(false))

test('areEqual false null', () =>
  expect(areEqual(false, null)).toBe(false))

test('areEqual null false', () =>
  expect(areEqual(null, false)).toBe(false))

test('areEqual true null', () =>
  expect(areEqual(true, null)).toBe(false))

test('areEqual null true', () =>
  expect(areEqual(null, true)).toBe(false))

/**
 * Arrays
 */

test('areEqual arrays', () =>
  expect(areEqual([1, 2, 3], [1, 2, 3])).toBe(true))

test('areEqual reversed array', () =>
  expect(areEqual([3, 2, 1], [1, 2, 3])).toBe(false))

test('areEqual reversed second array', () =>
  expect(areEqual([1, 2, 3], [3, 2, 1])).toBe(false))

test('areEqual unequal arrays', () =>
  expect(areEqual([1], [1, 2])).toBe(false))

test('areEqual unequal arrays reversed', () =>
  expect(areEqual([1, 2], [1])).toBe(false))

test('areEqual {} in arrays', () =>
  expect(areEqual([{}], [{}])).toBe(true))

test('areEqual different {} in arrays', () =>
  expect(areEqual([{ a: {} }], [{}])).toBe(false))

test('areEqual nested {} in arrays', () =>
  expect(areEqual(
      [{ a: { b: {} } }],
      [{ a: { b: {} } }]))
    .toBe(true))

test('areEqual nested arrays', () =>
  expect(
      areEqual(
        [1, [2, [3], 4], [5]],
        [1, [2, [3], 4], [5]]))
    .toBe(true))

test('areEqual nested unequal arrays', () =>
  expect(
      areEqual(
        [1, [2, [3], 4], [5]],
        [1, [2, [3, 6], 4], [5]]))
    .toBe(false))

/**
 * Objects
 */

test('areEqual objects', () =>
  expect(
      areEqual(
        { a: 0, b: '' },
        { b: '', a: 0 }))
    .toBe(true))

test('areEqual empty objects in objects', () =>
  expect(
      areEqual({ a: {} }, { a: {} }))
    .toBe(true))

test('areEqual empty arrays in objects', () =>
  expect(
      areEqual({ a: [] }, { a: [] }))
    .toBe(true))

test('areEqual arrays in objects', () =>
  expect(
      areEqual({ a: [1, 2] }, { a: [1, 2] }))
    .toBe(true))

test('areEqual nested arrays in objects', () =>
  expect(
      areEqual(
        { a: [1, [2, [3], 4], [5]] },
        { a: [1, [2, [3], 4], [5]] }))
    .toBe(true))

test('areEqual nested unequal arrays in objects', () =>
  expect(
      areEqual(
        { a: [1, [2, [3], 4], [5]] },
        { a: [1, [2, [3, 6], 4], [5]] }))
    .toBe(false))

test('areEqual arrays wrong element order in objects', () =>
  expect(
      areEqual({ a: [1, 2] }, { a: [2, 1] }))
    .toBe(false))

test('areEqual different arrays in objects', () =>
  expect(
      areEqual({ a: [1, 2] }, { a: [1] }))
    .toBe(false))

test('areEqual different arrays in objects reverse', () =>
  expect(
      areEqual({ a: [1] }, { a: [1, 2] }))
    .toBe(false))

test('areEqual extra element in first', () =>
  expect(
      areEqual(
        { a: 0, b: 0 },
        { a: 0 }))
    .toBe(false))

test('areEqual extra element in second', () =>
  expect(
      areEqual(
        { a: 0 },
        { a: 0, b: 0 }))
    .toBe(false))

test('areEqual nested objects', () =>
  expect(
      areEqual(
        { a: { b: { c: {}, d: 1 } } },
        { a: { b: { d: 1, c: {} } } }))
    .toBe(true))

test('areEqual nested objects unequal keys', () =>
  expect(
      areEqual(
        { a: { b: { c: {}, d: 1 } } },
        { a: { b: { d: 1, z: {} } } }))
    .toBe(false))

test('areEqual nested objects unequal values', () =>
  expect(
      areEqual(
        { a: { b: { c: {}, d: 1 } } },
        { a: { b: { d: 1, c: '' } } }))
    .toBe(false))
