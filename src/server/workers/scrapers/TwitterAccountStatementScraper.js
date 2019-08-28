import OAuth from 'oauth'
import config from '../../config'
import { STATEMENT_SCRAPER_NAMES } from './constants'

import {
  isTwitterScreenName,
  getTwitterApiUrlForUserTimeline,
  parseJsonIntoTweets,
  extractStatementsFromTweets,
} from '../../utils/twitter'

import AbstractStatementScraper from './AbstractStatementScraper'

class TwitterAccountStatementScraper extends AbstractStatementScraper {
  constructor(screenName) {
    if (!isTwitterScreenName(screenName)) {
      throw new Error('TwitterAccountStatementScraper was passed a string that does not appear to be a valid Twitter screen name.')
    }
    super(getTwitterApiUrlForUserTimeline(screenName))
  }

  getScraperName = () => STATEMENT_SCRAPER_NAMES.TWITTER_ACCOUNT

  generateScrapeHeaders = async () => ({
    Authorization: await this.getAuthorizationHeader(),
  })

  getAuthorizationHeader = async () => {
    const oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      config.TWITTER_CONSUMER_KEY,
      config.TWITTER_CONSUMER_SECRET,
      '1.0',
      null,
      'HMAC-SHA1',
    )

    return oauth.authHeader(
      this.getScrapeUrl(),
      config.TWITTER_OAUTH_TOKEN,
      config.TWITTER_OAUTH_TOKEN_SECRET,
      'GET',
    )
  }

  extractStatementsFromTwitterApiResponse = (responseString) => {
    const stepSequence = [
      parseJsonIntoTweets,
      extractStatementsFromTweets,
    ] // Note that order does matter here

    const statements = stepSequence.reduce((string, fn) => fn(string), responseString)
    return statements
  }

  statementScrapeHandler = (responseString) => {
    const statements = this.extractStatementsFromTwitterApiResponse(responseString)
    return statements
  }
}

export default TwitterAccountStatementScraper
