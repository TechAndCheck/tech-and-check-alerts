import fs from 'fs'
import Handlebars from 'handlebars'

import { getAddressForMailingList } from '../utils/mailer'
import Mailer from '../workers/mailer'
import logger from '../utils/logger'

class AbstractNewsletter {
  getMailingList = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getMailingList()')
  }

  getPathToTemplate = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getPathToTemplate()')
  }

  getSubject = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getSubject()')
  }

  // We aren't yet performing newsletter-specific scheduling.
  // getSchedule = () => {
  //   throw new Error('You extended AbstractNewsletter but forgot to define getSchedule()')
  // }

  getBodyData = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getBodyData()')
  }

  messageData = () => {
    if (!this.body) {
      throw new Error('You have to call the render() method to render newsletter content before generating message data.')
    }
    return {
      recipient: getAddressForMailingList(this.getMailingList()),
      subject: this.getSubject(),
      body: this.body,
    }
  }

  async render() {
    const templateSource = fs.readFileSync(this.getPathToTemplate(), 'utf8')
    const templateFn = Handlebars.compile(templateSource)
    const bodyData = await this.getBodyData()
    this.body = templateFn(bodyData)
  }

  send = () => this.render()
    .then(() => (new Mailer()).send(this.messageData()))
    .catch((error) => {
      logger.error(`Could not render the newsletter ${this.constructor.name}:`)
      logger.error(error)
    })
}

export default AbstractNewsletter
