import { getFileContents } from '../utils'
import {
  getHandlebarsTemplate,
  convertClaimNewsletterToText,
} from '../utils/templates'
import Mailer from '../workers/mailer'
import logger from '../utils/logger'
import { MAILING_LIST_ADDRESSES } from './constants'

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
   * @return {String} The key name of the associated mailing list
   */
  getMailingList = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getMailingList()')
  }

  /**
   * Abstract method that provides the absolute path to the newsletter's Handlebars template.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {String} The absolute path to the associated Handlebars template
   */
  getPathToTemplate = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getPathToTemplate()')
  }

  /**
   * Abstract method that provides the email subject line for the newsletter.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {String} The newsletter's email subject line
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
   * @return {Object} The object that will be passed to the templating function
   */
  getBodyData = async () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getBodyData()')
  }

  /**
   * Provides the email address for the mailing list associated with the newsletter.
   * Throws an error if there is none, because that makes the newsletter undeliverable
   * and means we've either configured it incorrectly or setup our addresses incorrectly.
   *
   * @return {String} The email address for the associated mailing list
   */
  getMailingListAddress = () => {
    const mailingList = this.getMailingList()
    const mailingListAddress = MAILING_LIST_ADDRESSES[mailingList]
    if (!mailingListAddress) throw new Error(`There is no email address associated with the mailing list ${mailingList}.`)
    return mailingListAddress
  }

  /**
   * Creates the HTML email body by reading the associated template file contents, using it to
   * compile a Handlebars template function, generating the necessary body data, and attempting
   * to render the template using that data. Marked async because `getBodyData()` will likely
   * query the database, and we want to wait for its response.
   *
   * There are several possible failure points here, so the whole thing is wrapped in a try/catch.
   *
   * @return {String} Rendered email body as HTML
   */
  getBodyHTML = async () => {
    try {
      const templateSource = getFileContents(this.getPathToTemplate())
      const handlebarsTemplate = getHandlebarsTemplate(templateSource)
      this.bodyData = this.bodyData || await this.getBodyData()
      this.bodyHTML = this.bodyHTML || handlebarsTemplate(this.bodyData)
      return this.bodyHTML
    } catch (error) {
      throw new Error(`Unable to compile HTML template. ${error}`)
    }
  }

  /**
   * Creates the text email body by generating the HTML body (if necessary) then converting the HTML
   * to text. Marked async because if we have to generate the HTML body, that call is async.
   *
   * There are several possible failure points here, so the whole thing is wrapped in a try/catch.
   *
   * @return {String} Rendered email body as text only
   */
  getBodyText = async () => {
    try {
      if (!this.bodyHTML) await this.getBodyHTML()
      this.bodyText = convertClaimNewsletterToText(this.bodyHTML)
      return this.bodyText
    } catch (error) {
      throw new Error(`Unable to compile text template. ${error}`)
    }
  }

  /**
   * Creates a message configuration object to pass to the Mailer. Marked as async since generating
   * the body eventually queries the database and we want to wait on that.
   *
   * @return {Object} Newsletter-specific message configuration for the mailer
   */
  getMessageData = async () => ({
    recipient: this.getMailingListAddress(),
    subject: this.getSubject(),
    bodyText: await this.getBodyText(),
    bodyHTML: await this.getBodyHTML(),
  })

  /**
   * Generates and sends the newsletter. Marked as async because generating the message data queries
   * the database and we want to wait on that.
   *
   * @return {Promise} The promise generated by the Mailer's send()
   */
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
