import models from '../server/models'

// We need to ensure DB connections are closed after each test suite is run.
// This is because Sequelize does not automatically close its connection pools
//
// Note: since Jest runs tests in parallel it is not enough to close in a global
// teardown.
//
// You can learn more about the problem here:
// https://stackoverflow.com/questions/60217417/jest-tests-hang-due-to-open-sequelize-connections/60267873
afterAll(() => models.sequelize.close())
