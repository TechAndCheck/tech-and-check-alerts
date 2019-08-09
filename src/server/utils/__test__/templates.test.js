import {
  getHandlebarsTemplate,
  stripHTMLTags,
  inlineTemplateStyles,
} from '../templates'

const templateTestData = {
  sanitizing: {
    simple: {
      original: '<p>This is a paragraph with some <b>bold text</b> and a <a href="#">link to something</a>.</p>',
      sanitized: 'This is a paragraph with some bold text and a link to something.',
    },
  },
  inlining: {
    simple: {
      original: '<style>div{color:red;}</style><div>Hello.</div>',
      inlined: '<div style="color: red;">Hello.</div>',
    },
  },
}

describe('utils/templates', () => {
  describe('getHandlebarsTemplate', () => {
    const templateFn = getHandlebarsTemplate('Hello')
    it('Should generate a handlebars template function given valid source', () => {
      expect(templateFn).toBeInstanceOf(Function)
    })
    it('Should generate a handlebars template function that actually renders a template', () => {
      expect(templateFn()).toBe('Hello')
    })
  })
  describe('stripHTMLTags', () => {
    it('Should strip HTML tags', () => {
      const {
        sanitizing: {
          simple: { original, sanitized },
        },
      } = templateTestData
      const convertedText = stripHTMLTags(original)
      expect(convertedText).toEqual(sanitized)
    })
  })
  describe('inlineTemplateStyles', () => {
    it('Should inline styles', () => {
      const {
        inlining: {
          simple: { original, inlined },
        },
      } = templateTestData
      const result = inlineTemplateStyles(original)
      expect(result).toEqual(inlined)
    })
  })
})
