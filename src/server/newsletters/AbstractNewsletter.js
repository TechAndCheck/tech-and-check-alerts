import fs from 'fs'
import Handlebars from 'handlebars'

import Mailer from '../workers/mailer'

class AbstractNewsletter {
  getPathToTemplate = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getPathToTemplate()')
  }

  getRecipient = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getRecipient()')
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
      recipient: this.getRecipient(),
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

  send = () => this.render().then(() => (new Mailer()).send(this.messageData()))
}

export default AbstractNewsletter
