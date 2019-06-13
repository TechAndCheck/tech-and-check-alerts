import Mailer from '../server/workers/mailer'

import { HelloWorldNewsletter } from '../server/newsletters'

const sendTestNewsletter = () => new Promise(() => {
  const newsletter = new HelloWorldNewsletter()
  return newsletter.render().then(() => {
    const messageData = newsletter.messageData()
    const mailer = new Mailer()
    return Promise.resolve(mailer.send(messageData))
  })
})
sendTestNewsletter().then(() => {
  process.exit()
})
