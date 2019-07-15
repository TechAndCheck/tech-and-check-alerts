import {
  promisifyClient,
  parseTime,
  parseTimes,
} from '../redis'

describe('utils/redis', () => {
  describe('promisifyClient', () => {
    it('Should promisify the key methods', () => {
      const newClient = promisifyClient({
        get: callback => callback(),
        lrange: callback => callback(),
      })
      expect(newClient.getAsync)
        .toBeDefined()
      expect(newClient.lrangeAsync)
        .toBeDefined()
    })
  })

  describe('parseTime', () => {
    it('Should parse valid timestamps', () => {
      const time = parseTime('1561062159371')
      expect(time)
        .toBeDefined()
      expect(time.isValid())
        .toBe(true)
      expect(time.format('YYYY-MM-DD'))
        .toEqual('2019-06-20')
    })
    it('Should return null for invalid timestamps', () => {
      expect(parseTime(''))
        .toBe(null)
      expect(parseTime('I Love Lamp'))
        .toBe(null)
    })
  })

  describe('parseTimes', () => {
    it('Should parse valid timestamps', () => {
      const time = parseTimes(['1561062159371'])
      expect(time[0])
        .toBeDefined()
      expect(time[0].isValid())
        .toBe(true)
      expect(time[0].format('YYYY-MM-DD'))
        .toEqual('2019-06-20')
    })
    it('Should return null for invalid timestamps', () => {
      expect(parseTimes(['']))
        .toEqual([null])
      expect(parseTimes(['I Love Lamp']))
        .toEqual([null])
    })
  })
})
