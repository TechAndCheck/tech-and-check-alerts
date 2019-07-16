// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */
import Handlebars from 'handlebars'

export const getHandlebarsTemplate = templateSource => Handlebars.compile(templateSource)
