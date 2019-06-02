export default {
  recipient: {
    valid: [
      'test@test.com',
      't@t.co',
      'first+last@test.com',
      'first.last@test.com',
      'test@test.co.uk',
    ],
    invalid: [
      '@test.com',
      'test@',
      'test',
      'test@test',
    ],
  },
  subject: {
    valid: ['You are invited.'],
    invalid: ['', 1, false],
  },
  body: {
    valid: ['You are invited by anyone to do anything. You are invited for all time... You are so needed by everyone to do everything You are invited for all time'],
    invalid: ['', 1, false],
  },
}
