export default {
  recipient: {
    valid: [
      'test@example.com',
      't@example.co',
      'first+last@example.com',
      'first.last@example.com',
      'test@example.co.uk',
    ],
    invalid: [
      '@example.com',
      'test@',
      'test',
      'test@example',
    ],
  },
  subject: {
    valid: ['You are invited.'],
    invalid: ['', 1, false],
  },
  body: {
    text: {
      valid: ['You are invited by anyone to do anything, you are invited for all time. You are so needed by everyone to do everything, you are invited for all time...'],
      invalid: ['', 1, false],
    },
  },
}
