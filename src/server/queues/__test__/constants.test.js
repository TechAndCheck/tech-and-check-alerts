import { QueueNames } from '../constants'

describe('queue constants', () => {
  describe('QueueNames', () => {
    it('should not have any repeated queue names', () => {
      const allQueueNames = Object.values(QueueNames).reduce(
        (aggregate, bucket) => aggregate.concat(Object.values(bucket)),
        [],
      ).sort()
      const uniqueQueueNames = Array.from(new Set(allQueueNames))
      expect(uniqueQueueNames).toEqual(allQueueNames)
    })
  })
})
