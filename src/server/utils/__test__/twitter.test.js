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
  extractScreenName,
  getScreenNameHash,
  getBestName,
  getScreenNamesFromStatements,
  normalizeStatementSpeaker,
} from '../twitter'

import {
  tweet,
  tweets,
  statement,
  statements,
  extractedStatements,
  normalizedStatement,
  screenNameHashes,
  validScreenNames,
  invalidScreenNames,
} from './twitterTestData'

describe('isTwitterScreenName', () => {
  it('Should accept valid twitter screen names', () => {
    validScreenNames.forEach((screenName) => {
      expect(isTwitterScreenName(screenName))
        .toBe(true)
    })
  })
  it('Should reject invalid twitter handles', () => {
    invalidScreenNames.forEach((screenName) => {
      expect(isTwitterScreenName(screenName))
        .toBe(false)
    })
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
    expect(extractStatementsFromTweets(tweets))
      .toEqual(extractedStatements)
  })
})
describe('getCanonicalUrlFromTweet', () => {
  it('Should properly generate canonical URLs for a tweet', () => {
    expect(getCanonicalUrlFromTweet(tweet))
      .toEqual(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
  })
})
describe('getSpeakerNameFromTweet', () => {
  it('Should pull the user display name from a tweet', () => {
    expect(getSpeakerNameFromTweet(tweet))
      .toEqual(tweet.user.name)
  })
})
describe('getSourceFromTweet', () => {
  it('Should pull the user screen name from a tweet', () => {
    expect(getSourceFromTweet(tweet))
      .toEqual(tweet.user.screen_name)
  })
})
describe('getTextFromTweet', () => {
  it('Should pull the text from a tweet', () => {
    expect(getTextFromTweet(tweet))
      .toEqual(tweet.full_text)
  })
})
describe('getSpeakerAffiliationFromTweet', () => {
  it('Should pull the user description from a tweet', () => {
    expect(getSpeakerAffiliationFromTweet(tweet))
      .toEqual(tweet.user.description)
  })
})
describe('extractScreenName', () => {
  it('Should extract screen names', () => {
    expect(extractScreenName('https://www.twitter.com/SenatorBurr')).toEqual('SenatorBurr')
    expect(extractScreenName('http://wwww.twitter.com/jeffnc2')).toEqual('jeffnc2')
    expect(extractScreenName('http://twitter.com/CalforNC')).toEqual('CalforNC')
    expect(extractScreenName('http://twitter.com/CalforNC?q=15')).toEqual('CalforNC')
    expect(extractScreenName('@slifty')).toEqual('slifty')
    expect(extractScreenName('@slifty_again')).toEqual('slifty_again')
    expect(extractScreenName('http://twitter.com/CalforNC?q=15')).toEqual('CalforNC')
    expect(extractScreenName('twitter.com/cabgop')).toEqual('cabgop')
    expect(extractScreenName('https://twitter.com/@JudgeHeathNC')).toEqual('JudgeHeathNC')
  })
  it('Should not extract screen names from invalid strings', () => {
    expect(extractScreenName('http://haywooddemocrats.org/slifty')).toEqual('')
  })
  it('Should not extract invalid screen names', () => {
    expect(extractScreenName('---')).toEqual('')
    expect(extractScreenName('@slifty_but_way_too_long_for_twitter')).toEqual('')
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
