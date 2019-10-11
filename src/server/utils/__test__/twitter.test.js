import {
  isTwitterScreenName,
  getTwitterApiUrlForUserTimeline,
  parseJsonIntoTweets,
  extractStatementsFromTweets,
  getCanonicalUrlFromTweet,
  getSpeakerNameFromTweet,
  getSourceFromTweet,
  getTextFromTweet,
  getSpeakerAffiliationFromTweet,
  getScreenNameHash,
  getBestName,
  getScreenNamesFromStatements,
  normalizeStatementSpeaker,
} from '../twitter'

import {
  statement,
  statements,
  normalizedStatement,
  screenNameHashes,
} from './twitterTestData'

const exampleTweet = {
  id_str: '12345',
  full_text: 'Text',
  user: {
    name: 'Name',
    screen_name: 'screenName',
    description: 'Bio',
  },
}
const exampleTweets = [exampleTweet]

describe('isTwitterScreenName', () => {
  it('Should accept valid twitter screen names', () => {
    expect(isTwitterScreenName('slifty'))
      .toBe(true)
    expect(isTwitterScreenName('sLiFtY'))
      .toBe(true)
    expect(isTwitterScreenName('@slifty'))
      .toBe(true)
    expect(isTwitterScreenName('justin_is_lame'))
      .toBe(true)
    expect(isTwitterScreenName('justin_is_lame2'))
      .toBe(true)
  })
  it('Should reject invalid twitter handles', () => {
    expect(isTwitterScreenName('this is not a handle'))
      .toBe(false)
    expect(isTwitterScreenName('longlonglonglonglonglonglonglonglongtwitterhandle'))
      .toBe(false)
  })
})
describe('getTwitterApiUrlForUserTimeline', () => {
  it('Should return a user timeline API url', () => {
    expect(getTwitterApiUrlForUserTimeline('slifty'))
      .toContain('https://api.twitter.com/1.1/statuses/user_timeline.json')
    expect(getTwitterApiUrlForUserTimeline('slifty'))
      .toContain('slifty')
  })
  it('Should return an API call that does not include retweets', () => {
    expect(getTwitterApiUrlForUserTimeline('slifty'))
      .toContain('include_rts=false')
  })
})
describe('parseJsonIntoTweets', () => {
  it('Should properly parse a JSON string', () => {
    expect(parseJsonIntoTweets('{}'))
      .toEqual({})
  })
})
describe('extractStatementsFromTweets', () => {
  it('Should properly convert a list of tweets into a list of statements', () => {
    expect(extractStatementsFromTweets(exampleTweets))
      .toEqual([{
        speaker: {
          name: exampleTweet.user.name,
          affiliation: exampleTweet.user.description,
        },
        text: exampleTweet.full_text,
        canonicalUrl: `https://twitter.com/${exampleTweet.user.screen_name}/status/${exampleTweet.id_str}`,
        source: exampleTweet.user.screen_name,
      }])
  })
})
describe('getCanonicalUrlFromTweet', () => {
  it('Should properly generate canonical URLs for a tweet', () => {
    expect(getCanonicalUrlFromTweet(exampleTweet))
      .toEqual(`https://twitter.com/${exampleTweet.user.screen_name}/status/${exampleTweet.id_str}`)
  })
})
describe('getSpeakerNameFromTweet', () => {
  it('Should pull the user display name from a tweet', () => {
    expect(getSpeakerNameFromTweet(exampleTweet))
      .toEqual(exampleTweet.user.name)
  })
})
describe('getSourceFromTweet', () => {
  it('Should pull the user screen name from a tweet', () => {
    expect(getSourceFromTweet(exampleTweet))
      .toEqual(exampleTweet.user.screen_name)
  })
})
describe('getTextFromTweet', () => {
  it('Should pull the text from a tweet', () => {
    expect(getTextFromTweet(exampleTweet))
      .toEqual(exampleTweet.full_text)
  })
})
describe('getSpeakerAffiliationFromTweet', () => {
  it('Should pull the user description from a tweet', () => {
    expect(getSpeakerAffiliationFromTweet(exampleTweet))
      .toEqual(exampleTweet.user.description)
  })
})
describe('getScreenNameHash', () => {
  it('Should correctly hash screen names', () => {
    screenNameHashes.forEach((screenName) => {
      expect(getScreenNameHash(screenName.unhashed)).toEqual(screenName.hashed)
    })
  })
})
describe('getBestName', () => {
  it('Should choose the best name of the bunch', () => {
    expect(getBestName('John', 'Paul')).toEqual('Paul')
    expect(getBestName('John', '')).toEqual('John')
    expect(getBestName('John')).toEqual('John')
  })
})
describe('getScreenNamesFromStatements', () => {
  it('Should extract screen names from array of statements', () => {
    expect(getScreenNamesFromStatements(statements)).toEqual(['reefdog'])
  })
})
describe('normalizeStatementSpeaker', () => {
  it('Should apply valid display name to speaker', () => {
    expect(normalizeStatementSpeaker(statement, {
      reefdog: 'Justin Reese',
    })).toEqual(normalizedStatement)
  })
  it('Should not apply invalid display name to speaker', () => {
    expect(normalizeStatementSpeaker(statement, '')).toEqual(statement)
  })
})
