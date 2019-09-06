# Testing

We use [jest](https://jestjs.io/) for automated tests in this project.

We aspire to have a full-blown robust unit and integration test suite, but for now there is a bit of discretion around what exactly warrants a new set of tests.  E.g., we are not testing code that relies on external resources such as databases or HTTP responses.

Still: if you write code that can be tested, please ensure all PRs include tests of that code.

## Generating tests for the CNN scraper

Since the CNN transcript scraper pipeline is fairly complex, we've created a tool to generate new unit tests for each step of the pipeline whenever we find a transcript that causes trouble.

### To create a test suite for a transcript that is being processed properly:

1. Run `yarn generate:test:cnn -u {FULL_TRANSCRIPT_URL_HERE}`

### To debug and correct the pipeline for a transcript that is not being processed properly:

1. Create a test suite (see above)
2. Open up the new test suite directory in `/src/server/utils/__test__/data/cnn`.  The suite directories reflect the suite index.  Indices are sequential and auto increment, so the new suite will be in the highest-numbered directory.
3. Find *the FIRST step* in the pipeline that failed (of the form `{stepNumber}_{stepName}.json`, e.g. `8_cleanStatementSpeakerNames.json`).
4. Correct the output attribute of that step to match whatever it should be.  The tests should now fail, since you have changed the test's expected output and it doesn't match what that step actually produced.
5. Make the appropriate corrections to the code so that all tests pass again.
6. Regenerate your new test suite by running `yarn generate:test:cnn -i {TEST_SUITE_INDEX}` (i.e., directory number).  This action ensures that the full pipeline reflects the output of the now-corrected step.
7. Verify that the final output is now what you expect.  If not, go back to step 3.
8. Commit your code correction and the entire new test suite.
