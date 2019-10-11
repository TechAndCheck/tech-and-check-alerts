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

export const screenNameHashes = [
  {
    unhashed: 'JohnSmith',
    hashed: 'johnsmith',
  },
]
