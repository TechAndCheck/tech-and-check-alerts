import logger from '../server/utils/logger'

import {
  HelloWorldNewsletter,
  NationalNewsletter,
} from '../server/newsletters'

let send = new Promise(resolve => resolve())

switch (process.argv[2]) {
  case '--national':
  case 'national':
    send = (new NationalNewsletter()).send()
    break
  default:
    send = (new HelloWorldNewsletter()).send()
    break
}

send.catch((error) => {
  logger.error(`Did not send the test newsletter. ${error}`)
}).then(() => {
  process.exit()
})
