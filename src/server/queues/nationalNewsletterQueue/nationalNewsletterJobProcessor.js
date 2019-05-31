import Mailer from '../../workers/mailer'

import { NationalNewsletter } from '../../newsletters'

// We may customize behavior based on job parameters, so don't forget how.
// But for now, don't complain that we aren't using `job`.
// eslint-disable-next-line no-unused-vars
export default (job) => {
  const newsletter = new NationalNewsletter()
  newsletter.render().then(() => {
    const mailerOptions = newsletter.mailerOptions()
    const mailer = new Mailer(mailerOptions)
    const mailerResults = mailer.send()
    return Promise.resolve(mailerResults)
  })
}
