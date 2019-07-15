import { getFileContents } from '../utils'
import { getHandlebarsTemplate } from '../utils/templates'
import { getAddressForMailingList } from '../utils/mailer'
import Mailer from '../workers/mailer'
import logger from '../utils/logger'

class AbstractNewsletter {
  constructor() {
    this.mailer = new Mailer()
  }

  getMailingList = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getMailingList()')
  }

  getPathToTemplate = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getPathToTemplate()')
  }

  getSubject = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getSubject()')
  }

  getBodyData = async () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getBodyData()')
  }

  getMailingListAddress = () => getAddressForMailingList(this.getMailingList())

  getBody = async () => {
    const templateSource = getFileContents(this.getPathToTemplate())
    const handlebarsTemplate = getHandlebarsTemplate(templateSource)
    const bodyData = await this.getBodyData()
    return handlebarsTemplate(bodyData)
  }

  getMessageData = async () => ({
    recipient: this.getMailingListAddress(),
    subject: this.getSubject(),
    body: await this.getBody(),
  })

  send = async () => {
    const messageData = await this.getMessageData()
    return this.mailer.send(messageData)
      .then(() => {
        logger.info(`Sent the newsletter ${this.constructor.name}.`)
      }).catch((error) => {
        logger.error(`Did not send the newsletter ${this.constructor.name}. ${error}`)
        return Promise.reject(error)
      })
  }
}

export default AbstractNewsletter
