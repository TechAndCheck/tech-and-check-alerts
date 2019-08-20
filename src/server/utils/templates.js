import fs from 'fs'
import Handlebars from 'handlebars'
import sanitizeHTML from 'sanitize-html'
import juice from 'juice'

import {
  CLAIM_PLATFORM_NAMES,
  CNN_SHOW_NAMES,
} from '../constants'
import {
  STATEMENT_SCRAPER_NAMES,
} from '../workers/scrapers/constants'
import {
  getFileContents,
  runSequence,
  hasKey,
} from '.'

const TEMPLATE_PARTIALS_DIRECTORY = `${__dirname}/../newsletters/templates/partials/`

const isHandlebarsTemplate = fileName => fileName.endsWith('.hbs')

const getHandlebarsPartials = () => fs.readdirSync(TEMPLATE_PARTIALS_DIRECTORY)
  .filter(fileName => isHandlebarsTemplate(fileName))

const registerHandlebarsPartial = (fileName) => {
  const templateSource = getFileContents(`${TEMPLATE_PARTIALS_DIRECTORY}/${fileName}`)
  const partialName = fileName.replace('.hbs', '')
  Handlebars.registerPartial(partialName, templateSource)
}

const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper('convertScraperNameToPlatformName', (scraperName) => {
    const sharedKey = Object.keys(STATEMENT_SCRAPER_NAMES)
      .find(scraperNameKey => STATEMENT_SCRAPER_NAMES[scraperNameKey] === scraperName)
    return CLAIM_PLATFORM_NAMES[sharedKey]
  })
  Handlebars.registerHelper('humanizeSource', (source, scraperName) => {
    if (scraperName === STATEMENT_SCRAPER_NAMES.CNN_TRANSCRIPT && hasKey(CNN_SHOW_NAMES, source)) {
      return new Handlebars.SafeString(`<span class="claim__source">on ${CNN_SHOW_NAMES[source]}</span>`)
    }
    return ''
  })
}

const registerHandlebarsPartials = () => {
  const partials = getHandlebarsPartials()
  return partials.map(registerHandlebarsPartial)
}

export const getHandlebarsTemplate = (templateSource) => {
  registerHandlebarsHelpers()
  registerHandlebarsPartials()
  return Handlebars.compile(templateSource)
}

export const stripHTMLTags = html => sanitizeHTML(html, {
  allowedTags: [],
  parser: {
    decodeEntities: true,
  },
})

const removeRepetitiveNewlines = text => text.replace(/\n{3,}/g, '\n')
const removeRepetitiveSpaces = text => text.replace(/ {2,}/g, ' ')
const removeTrailingSpaces = text => text.replace(/ \n/g, '\n')
const removeLeadingSpaces = text => text.replace(/\n /g, '\n')
const trimOuter = text => text.trim()
// `decodeAmpersands()` should be unnecessary, but sanitizeHTML's `decodeEntities` doesn't work
const decodeAmpersands = text => text.replace(/&amp;/g, '&')

/**
 * Cleans HTML out of the text-only version of the newsletter. This is basically so we can reuse
 * the boilerplate, which contains HTML, but also cleans up unintended whitespace.
 *
 * @return {String} The text template cleaned of HTML
 */
export const cleanNewsletterTemplate = template => runSequence([
  stripHTMLTags,
  decodeAmpersands,
  removeRepetitiveSpaces,
  removeTrailingSpaces,
  removeLeadingSpaces,
  removeRepetitiveNewlines,
  trimOuter,
], template)

export const moveStylesInline = template => juice(template)
