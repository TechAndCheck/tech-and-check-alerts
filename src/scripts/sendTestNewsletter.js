import logger from '../server/utils/logger'

import { HelloWorldNewsletter } from '../server/newsletters'

const sendTestNewsletter = () => (new HelloWorldNewsletter()).send()

sendTestNewsletter().then(() => {
  process.exit()
}).catch(error => logger.error(error))
