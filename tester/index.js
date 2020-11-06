const { areEqual } = require('./util')

const tests = []

function createTest(name, callback) {
  return {
    name,
    callback,
    finished: false,
    passed: false
  }
}

function scheduleTest(test) {
  tests.push(test)
}

function runTest(test) {
  const { name, callback } = test

  try {
    callback()
    const passMessage = `[ OK ]  ${name}`
    console.log(passMessage)
    test.passed = true
  } catch (e) {
    const failMessage = `[ -- ]  ${name}`
    console.log(failMessage)
    console.log(e)
    test.passed = false
  } finally {
    test.finished = true
  }
}

function runAllTests() {
  const startMessage = `Running ${tests.length} tests`

  console.log(`${startMessage}\n`)

  tests.forEach(runTest)

  const numberOfFalsyTests = tests.filter(test =>
    test.finished && !test.passed).length

  const numberOfTruthyTests = tests.length - numberOfFalsyTests

  const passResultMessage = `${numberOfTruthyTests} tests passed`
  const failResultMessage = `${numberOfFalsyTests} tests failed`

  console.log(`\n${passResultMessage}`)
  console.log(failResultMessage)
}

function runExpectation(expectedValue, value, bool) {
  if (!bool) {
    const errorMessage = `
      Expected  ${JSON.stringify(expectedValue)}
      Got       ${JSON.stringify(value)}
    `

    throw errorMessage
  }
}

exports.expect = function(value) {
  return {
    toBe: expectedValue => runExpectation(
      expectedValue, value, value === expectedValue),

    toEqual: expectedValue => runExpectation(
      expectedValue, value, areEqual(value, expectedValue))
  }
}

exports.test = function(name, callback) {
  const newTest = createTest(name, callback)
  scheduleTest(newTest)
}

function runTestFile(path) {
  require(path)
  runAllTests()
}

function main() {
  const calledFromCommandLine = require.main === module

  if (calledFromCommandLine) {
    const userArgs = process.argv.slice(2)
    const testPath = userArgs[0]

    if (testPath) {
      const callPath = process.cwd()
      const fullTestPath = `${callPath}/${testPath}`

      runTestFile(fullTestPath)
    } else {
      throw new Error('No test path specified')
    }
  }
}

main()
