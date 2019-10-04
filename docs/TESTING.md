# Testing

We use [jest](https://jestjs.io/) for automated tests in this project.

We aspire to have a full-blown robust unit and integration test suite, but for now there is a bit of discretion around what exactly warrants a new set of tests.  E.g., we are not testing code that relies on external resources such as databases or HTTP responses.

Still: if you write code that can be tested, please ensure all PRs include tests of that code.

## Test organization

### Unit Tests
Unit tests should be placed in a __test__/ directory that lives at the same level of the file being tested.  Each file should have a parallel `.test.js`

For example: 

```
|- /src
|  |- __test__
|  |  |- sillyHat.test.js
|  |- sillyHat.js
```

### Integration Tests

Since integration tests often involve multiple files, they should live in a common `src/tests` directory.  We have not yet written any integration tests so this documentation should be updated when that occurs.

### Test Data

Test data should be placed in a file that is sibling to the test file and have the `TestData.js` prefix.

For example: 

```
|- /src
|  |- __test__
|  |  |- sillyHat.test.js
|  |  |- sillyHatTestData.js
|  |- sillyHat.js
```

### Test Suite Data

Regression test suites, where applicable, should store regression suite data in a `data` directory that is sibling to the test file, inside of a folder that is named after the file being tested.  The data itself should be named according to the needs of the test suite.

For example: 

```
|- /src
|  |- __test__
|  |  |- data
|  |  |  |- sillyHat
|  |  |  |  |- 1
|  |  |  |  |  |- methodName.js
|  |  |- sillyHat.test.js
|  |- sillyHat.js
```

## Specialized Documentation

Below is instruction on writing test for specific components of the system.

### Generating tests for the CNN scraper

Since the CNN transcript scraper pipeline is fairly complex, we've created a tool to generate new unit tests for each step of the pipeline whenever we find a transcript that causes trouble.

#### To create a test suite for a transcript that is being processed properly:

1. Run `yarn generate:test:cnn -u {FULL_TRANSCRIPT_URL_HERE}`

#### To debug and correct the pipeline for a transcript that is not being processed properly:

1. Create a test suite (see above)
2. Open up the new test suite directory in `/src/server/utils/__test__/data/cnn`.  The suite directories reflect the suite index.  Indices are sequential and auto increment, so the new suite will be in the highest-numbered directory.
3. Find *the FIRST step* in the pipeline that failed (of the form `{stepNumber}_{stepName}.json`, e.g. `8_cleanStatementSpeakerNames.json`).
4. Correct the output attribute of that step to match whatever it should be.  The tests should now fail, since you have changed the test's expected output and it doesn't match what that step actually produced.
5. Make the appropriate corrections to the code so that all tests pass again.
6. Regenerate your new test suite by running `yarn generate:test:cnn -i {TEST_SUITE_INDEX}` (i.e., directory number).  This action ensures that the full pipeline reflects the output of the now-corrected step.
7. Verify that the final output is now what you expect.  If not, go back to step 3.
8. Commit your code correction and the entire new test suite.
