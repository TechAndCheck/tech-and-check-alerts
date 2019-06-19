import Mailer from '../workers/mailer'

import { TEMPLATES } from './constants'

class AbstractNewsletter {
  getTemplate = () => TEMPLATES.DEFAULT

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

  getCollectClaims = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getCollectClaims()')
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
    const claims = await this.getCollectClaims()
    // TODO: Pass the data through a real renderererer.
    this.body = `CLAIMS:\r${claims.map(claim => claim.content).join('\r')}`
  }

  send = () => this.render().then(() => (new Mailer()).send(this.messageData()))
}

export default AbstractNewsletter
