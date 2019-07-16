import logger from '../server/utils/logger'

import { HelloWorldNewsletter } from '../server/newsletters'

const sendTestNewsletter = () => (new HelloWorldNewsletter()).send()

sendTestNewsletter().catch((error) => {
  logger.error(`Did not send the test newsletter. ${error}`)
}).then(() => {
  process.exit()
})
