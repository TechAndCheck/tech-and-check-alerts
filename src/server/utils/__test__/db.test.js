import {
  doesRecordExist,
} from '../db'

describe('doesRecordExist', () => {
  it('Should not consder null records as existing', () => {
    expect(doesRecordExist(null))
      .toEqual(false)
  })
  it('Should identify non null records as existing', () => {
    expect(doesRecordExist({}))
      .toEqual(true)
  })
})
