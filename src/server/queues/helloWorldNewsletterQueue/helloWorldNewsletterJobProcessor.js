import Mailer from '../../workers/mailer'

import { HelloWorldNewsletter } from '../../newsletters'

// We may customize behavior based on job parameters, so don't forget how.
// But for now, don't complain that we aren't using `job`.
// eslint-disable-next-line no-unused-vars
export default (job) => {
  const newsletter = new HelloWorldNewsletter()
  newsletter.render().then(() => {
    const messageData = newsletter.messageData()
    const mailer = new Mailer()
    return Promise.resolve(mailer.send(messageData))
  })
}
