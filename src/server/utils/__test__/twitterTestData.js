export const tweet = {
  id_str: '12345',
  full_text: 'Text',
  user: {
    name: 'Name',
    screen_name: 'screenName',
    description: 'Bio',
  },
}
export const tweets = [tweet]

export const extractedStatement = {
  speaker: {
    name: tweet.user.name,
    affiliation: tweet.user.description,
  },
  text: tweet.full_text,
  canonicalUrl: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
  source: tweet.user.screen_name,
}
export const extractedStatements = [extractedStatement]

export const statement = {
  speaker: {
    name: 'justin spooky reese',
    affiliation: 'BIFFUD',
  },
  source: 'reefdog',
  text: 'Booooffud!',
}
export const statements = [statement]

export const normalizedStatement = Object.assign({}, statement, {
  speaker: {
    ...statement.speaker,
    name: 'Justin Reese',
  },
})
export const normalizedStatements = [normalizedStatement]

export const validScreenNames = [
  'slifty',
  'sLiFtY',
  '@slifty',
  'justin_is_lame',
  'justin_is_lame2',
]

export const invalidScreenNames = [
  'this is not a handle',
  'longlonglonglonglonglonglonglonglongtwitterhandle',
]

export const screenNameHashes = [
  {
    unhashed: 'JohnSmith',
    hashed: 'johnsmith',
  },
]
