export const Schedules = {
  NONE: 'none',
  EVERY_MINUTE: '* * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_DAY: '0 0 * * *',
}

export const QueueNames = {
  crawlerQueues: {
    ABSTRACT: 'abstractCrawler',
    HELLO_WORLD: 'helloWorldCrawler',
  },
}
