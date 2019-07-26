import fs from 'fs'
import Handlebars from 'handlebars'
import sanitizeHTML from 'sanitize-html'

import { getFileContents } from '.'

const TEMPLATE_PARTIALS_DIRECTORY = `${__dirname}/../newsletters/templates/partials/`

const isHandlebarsTemplate = fileName => fileName.endsWith('.hbs')

const getHandlebarsPartials = () => fs.readdirSync(TEMPLATE_PARTIALS_DIRECTORY)
  .filter(fileName => isHandlebarsTemplate(fileName))

const registerHandlebarsPartial = (fileName) => {
  const templateSource = getFileContents(`${TEMPLATE_PARTIALS_DIRECTORY}/${fileName}`)
  const partialName = fileName.replace('.hbs', '')
  Handlebars.registerPartial(partialName, templateSource)
}

const registerHandlebarsPartials = () => {
  const partials = getHandlebarsPartials()
  return partials.map(registerHandlebarsPartial)
}

export const getHandlebarsTemplate = (templateSource) => {
  registerHandlebarsPartials()
  return Handlebars.compile(templateSource)
}

export const stripHTMLTags = html => sanitizeHTML(html, {
  allowedTags: [],
  parser: {
    decodeEntities: true,
  },
})

export const convertClaimNewsletterToText = (templateHTML) => {
  const removeRepetitiveSpaces = text => text.replace(/ {2,}/g, ' ')
  const removeTrailingSpaces = text => text.replace(/ \n/g, '\n')
  const removeLeadingSpaces = text => text.replace(/\n /g, '\n')
  const reduceMultipleNewlines = text => text.replace(/\n{3,}/g, '\n\n')
  const inlinePlatform = text => text.replace(/\n\(/g, ' (')
  const removeNewlinesBeforeContent = text => text.replace(/\):\n\n/g, '):\n')
  // `decodeAmpersands()` should be unnecessary, but sanitizeHTML's `decodeEntities` doesn't work
  const decodeAmpersands = text => text.replace(/&amp;/g, '&')
  const trimOuter = text => text.trim()

  const conversionSequence = [
    stripHTMLTags,
    removeRepetitiveSpaces,
    removeTrailingSpaces,
    removeLeadingSpaces,
    reduceMultipleNewlines,
    inlinePlatform,
    removeNewlinesBeforeContent,
    decodeAmpersands,
    trimOuter,
  ] // Note that order does matter here

  const templateText = conversionSequence.reduce((string, fn) => fn(string), templateHTML)
  return templateText
}
