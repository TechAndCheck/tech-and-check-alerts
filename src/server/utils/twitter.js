export const isTwitterScreenName = screenName => /^@?(\w){1,15}$/.test(screenName)

export const getTwitterApiUrlForUserTimeline = screenName => `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screenName}&include_rts=false&tweet_mode=extended`

export const parseJsonIntoTweets = input => JSON.parse(input)

export const getCanonicalUrlFromTweet = tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

export const getSpeakerNameFromTweet = tweet => tweet.user.name

export const getSourceFromTweet = tweet => tweet.user.screen_name

export const getTextFromTweet = tweet => tweet.full_text

export const getSpeakerAffiliationFromTweet = tweet => tweet.user.description

export const extractStatementsFromTweets = tweets => tweets.map(tweet => ({
  speaker: {
    name: getSpeakerNameFromTweet(tweet),
    affiliation: getSpeakerAffiliationFromTweet(tweet),
  },
  text: getTextFromTweet(tweet),
  source: getSourceFromTweet(tweet),
  canonicalUrl: getCanonicalUrlFromTweet(tweet),
}))
