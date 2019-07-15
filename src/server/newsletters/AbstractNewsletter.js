import { getFileContents } from '../utils'
import { getHandlebarsTemplate } from '../utils/templates'
import Mailer from '../workers/mailer'
import logger from '../utils/logger'

import { MAILING_LIST_ADDRESSES } from '../constants'

class AbstractNewsletter {
  constructor() {
    this.mailer = new Mailer()
  }

  /**
   * Abstract method that provides the mailing list key name associated with the newsletter.
   * However, don't return the key name as a string literal; return instead the value of the
   * appropriate property from the MAILING_LISTS constant, e.g. `return MAILING_LISTS.DEVELOPERS`.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {string} The key name of the associated mailing list
   */
  getMailingList = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getMailingList()')
  }

  /**
   * Abstract method that provides the absolute path to the newsletter's Handlebars template.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {string} The absolute path to the associated Handlebars template
   */
  getPathToTemplate = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getPathToTemplate()')
  }

  /**
   * Abstract method that provides the email subject line for the newsletter.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {string} The newsletter's email subject line
   */
  getSubject = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getSubject()')
  }

  /**
   * Abstract method that returns the data used to compose the newsletter body.
   * The object returned will be passed to the templating function, and its
   * properties made available to the template as local variables.
   *
   * This is an async function because it will often be querying the database.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {object} The object that will be passed to the templating function
   */
  getBodyData = async () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getBodyData()')
  }

  getMailingListAddress = () => {
    const mailingList = this.getMailingList()
    const mailingListAddress = MAILING_LIST_ADDRESSES[mailingList]
    if (!mailingListAddress) throw new Error(`There is no email address associated with the mailing list ${mailingList}.`)
    return mailingListAddress
  }

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
