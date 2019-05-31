import Mailer from '../server/workers/mailer'

import { NationalNewsletter } from '../server/newsletters'

const sendTestNewsletter = () => new Promise(() => {
  const newsletter = new NationalNewsletter()
  return newsletter.render().then(() => {
    const mailerOptions = newsletter.mailerOptions()
    const mailer = new Mailer(mailerOptions)
    const mailerResults = mailer.send()
    return Promise.resolve(mailerResults)
  })
})
sendTestNewsletter().then(() => {
  process.exit()
})
