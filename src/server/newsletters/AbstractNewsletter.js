import config from '../config'
import { getFileContents } from '../utils'
import {
  getMailingListAddress,
  guardMailingList,
} from '../utils/newsletters'
import {
  getHandlebarsTemplate,
  cleanNewsletterTemplate,
  moveStylesInline,
} from '../utils/templates'
import Mailer from '../workers/mailer'
import logger from '../utils/logger'

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
   * Abstract method that provides the absolute path to the newsletter's text-only Handlebars
   * template. This is the template that gets sent as the non-MIME/HTML email body, which is
   * important as a fallback if the client can't render the HTML.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {String} The absolute path to the associated Handlebars template
   */
  getPathToTextTemplate = () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getPathToTextTemplate()')
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
   * The object returned will be passed to the templating functions, and its
   * properties made available to the template as local variables.
   *
   * This is an async function because it will often be querying the database.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {Object} The object that will be passed to the templating functions
   */
  getBodyData = async () => {
    throw new Error('You extended AbstractNewsletter but forgot to define getBodyData()')
  }

  /**
   * Abstract method that performs whatever newsletter-specific validation we want that must be true
   * for the newsletter to send. For example, if a claim count is zero, we may not want to send the
   * newsletter. Conversely, if we always want a newsletter to send, you should still create a
   * `assertNewsletterIsSendable()` on the extending class and simply return true.
   *
   * This is an async function because it may require querying the database to generate body data.
   *
   * The implementation of this method should either throw an assertion error or return true.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {Boolean}
   */
  assertNewsletterIsSendable = async () => {
    throw new Error('You extended AbstractNewsletter but forgot to define assertNewsletterIsSendable()')
  }

  /**
   * If the body data cache is hot, the cache is returned. Otherwise, the cache is warmed and the
   * data returned.
   *
   * This behavior could be rolled into the base `getBodyData()`, except then:
     1. We'd have to remember to add the "check and return cache if it exists" to each extended
   *    class's version of `getBodyData()`, and
   * 2. The cache invocation would be silent. By using this function instead, we always know when
   *    we're hitting the cache.
   *
   * @return {Object} The object that will be passed to the templating functions
   */
  getCachedBodyData = async () => {
    if (this.bodyData) return this.bodyData
    await this.setCachedBodyData()
    return this.bodyData
  }

  /**
   * Cache the body data, less for performance than to ensure both template renders (text and HTML)
   * use the same data.
   *
   * @return {undefined}
   */
  setCachedBodyData = async () => {
    this.bodyData = await this.getBodyData()
  }

  /**
   * Expire the cached the body data. We don't use this, but it's good form to provide.
   *
   * @return {undefined}
   */
  expireCachedBodyData = () => {
    this.bodyData = null
  }

  /**
   * Provides the recipient mailing list address for the newsletter.
   *
   * There are two additions to allow us to test and develop newsletters without mistakenly sending
   * to real (i.e., production) recipient lists:
   * 1. If there is a valid MAILING_LIST_OVERRIDE environment variable, use that. We use this almost
   *    exclusively to test sending newsletters in otherwise production environments.
   * 2. If we're not running in production, the mailing list must be internal, or else it defaults
   *    to the devs list.
   * Note that if a non-production environment has MAILING_LIST_OVERRIDE set to an external mailing
   * list, it will get hammered into sending to the devs list.
   *
   * @return {String} The intended newsletter recipient
   */
  getRecipient = () => {
    const configuredMailingList = config.MAILING_LIST_OVERRIDE || this.getMailingList()
    const guardedMailingList = guardMailingList(configuredMailingList)
    return getMailingListAddress(guardedMailingList)
  }

  /**
   * Renders the Handlebars template provided by reading the associated template file contents,
   * using it to compile a Handlebars template function, generating the necessary body data, and
   * attempting to render the template using that data. Marked async because `getCachedBodyData()`
   * may query the database, and we want to wait for its response.
   *
   * There are several possible failure points here, so the whole thing is wrapped in a try/catch.
   *
   * @param  {String} templatePath Path to the template to be rendered
   * @return {String}              Rendered template
   */
  getRenderedTemplate = async (templatePath) => {
    try {
      const templateSource = getFileContents(templatePath)
      const handlebarsTemplate = getHandlebarsTemplate(templateSource)
      const bodyData = await this.getCachedBodyData()
      const renderedTemplate = handlebarsTemplate(bodyData)
      return renderedTemplate
    } catch (error) {
      throw new Error(`Unable to compile template. ${error}`)
    }
  }

  /**
   * Creates the HTML email body.  Marked async because `getRenderedTemplate()` may query the
   * database, and we want to wait for its response.
   *
   * @return {String} Rendered email body as HTML
   */
  getBodyHTML = async () => {
    const renderedTemplate = await this.getRenderedTemplate(this.getPathToTemplate())
    return moveStylesInline(renderedTemplate)
  }

  /**
   * Creates the text email body and passes it through a sanitizer, just in case HTML slipped in
   * via partials or scraped content.  Marked async because `getRenderedTemplate()` may query the
   * database, and we want to wait for its response.
   *
   * @return {String} Rendered email body as text only
   */
  getBodyText = async () => {
    const renderedTemplate = await this.getRenderedTemplate(this.getPathToTextTemplate())
    const cleanedTemplate = cleanNewsletterTemplate(renderedTemplate)
    return cleanedTemplate
  }

  /**
   * Creates a message configuration object to pass to the Mailer. Marked as async since generating
   * the body eventually queries the database and we want to wait on that.
   *
   * @return {Object} Newsletter-specific message configuration for the mailer
   */
  getMessageData = async () => ({
    recipient: this.getRecipient(),
    subject: this.getSubject(),
    body: {
      text: await this.getBodyText(),
      html: await this.getBodyHTML(),
    },
  })

  /**
   * Generates and sends the newsletter. Marked as async because generating the message data queries
   * the database and we want to wait on that.
   *
   * @return {Promise} The promise generated by the Mailer's send()
   */
  send = async () => {
    try {
      await this.assertNewsletterIsSendable()
    } catch (assertionError) {
      return Promise.reject(
        new Error(`The newsletter did not satisfy its sendability requirements. (Failed assertion: ${assertionError.message})`),
      )
    }
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
