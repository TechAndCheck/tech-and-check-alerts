import {
  isTranscriptListUrl,
  isTranscriptUrl,
  getFullCnnUrl,
  getTranscriptTextFromHtml,
  extractPublicationDateFromTranscriptUrl,
  removeTimestamps,
  removeSpeakerReminders,
  removeDescriptors,
  addBreaksOnSpeakerChange,
  splitTranscriptIntoChunks,
  getAttributionFromChunk,
  getTextFromChunk,
  getNameFromAttribution,
  getAffiliationFromAttribution,
  extractStatementFromChunk,
  extractStatementsFromChunks,
  getSpeakersFromStatements,
  cleanSpeakerName,
  cleanStatementSpeakerNames,
  hasIdenticalName,
  improvesName,
  improvesAffiliation,
  getBestAffiliation,
  getBestName,
  getNormalizedSpeaker,
  normalizeStatementSpeakers,
  removeNetworkAffiliatedStatements,
  removeUnattributableStatements,
} from '../cnn'
import testSuites from './data/cnn'

const runTestSuite = (fn) => {
  if (fn.name in testSuites) {
    testSuites[fn.name].forEach(test => it(`Should pass for ${test.filePath}`, () => {
      expect(fn(test.data.input))
        .toEqual(test.data.output)
    }))
  }
}

const runTestSuites = arr => arr.map(fn => describe(`${fn.name} (Suite)`, () => runTestSuite(fn)))

describe('utils/cnn', () => {
  describe('suites', () => {
    runTestSuites([
      getTranscriptTextFromHtml,
      removeTimestamps,
      removeSpeakerReminders,
      removeDescriptors,
      addBreaksOnSpeakerChange,
      splitTranscriptIntoChunks,
      extractStatementsFromChunks,
      cleanStatementSpeakerNames,
      normalizeStatementSpeakers,
      removeNetworkAffiliatedStatements,
      removeUnattributableStatements,
    ])
  })

  describe('isTranscriptListUrl', () => {
    it('Should not improperly identify transcript list URLs', () => {
      expect(isTranscriptListUrl('http://example.com/'))
        .toBe(false)
    })
    it('Should identify transcript list URLs', () => {
      expect(isTranscriptListUrl('/TRANSCRIPTS/2019.06.01.html'))
        .toBe(true)
    })
  })

  describe('isTranscriptUrl', () => {
    it('Should not improperly identify transcript URLs', () => {
      expect(isTranscriptUrl('http://example.com/'))
        .toBe(false)
    })
    it('Should identify transcript list URLs', () => {
      expect(isTranscriptUrl('/TRANSCRIPTS/1906/01/cnr.20.html'))
        .toBe(true)
      expect(isTranscriptUrl('https://transcripts.cnn.com/TRANSCRIPTS/1906/01/cnr.20.html'))
        .toBe(true)
      expect(isTranscriptUrl('http://transcripts.cnn.com/TRANSCRIPTS/1906/01/cnr.20.html'))
        .toBe(true)
    })
  })

  describe('getFullCnnUrl', () => {
    it('Should not modify a complete URL', () => {
      expect(getFullCnnUrl('http://example.com/'))
        .toBe('http://example.com/')
      expect(getFullCnnUrl('http://transcripts.cnn.com'))
        .toBe('http://transcripts.cnn.com')
    })
    it('Should convert a naked cnn.com URL', () => {
      expect(getFullCnnUrl('http://cnn.com'))
        .toBe('http://transcripts.cnn.com')
    })
    it('Should prepend a relative URL', () => {
      expect(getFullCnnUrl('TRANSCRIPTS'))
        .toBe('http://transcripts.cnn.com/TRANSCRIPTS')
    })
    it('Should prepend a relative URL starting with /', () => {
      expect(getFullCnnUrl('/TRANSCRIPTS'))
        .toBe('http://transcripts.cnn.com/TRANSCRIPTS')
    })
  })

  describe('extractPublicationDateFromTranscriptUrl', () => {
    it('Should extract dates', () => {
      const date = extractPublicationDateFromTranscriptUrl('/TRANSCRIPTS/1906/01/cnr.20.html')
      expect(date)
        .not.toBeNull()
      expect(date.format('YYYY-MM-DD'))
        .toEqual('2019-06-01')
    })
    it('Should throw an error on an invalid URL', () => {
      expect(() => extractPublicationDateFromTranscriptUrl('lololol'))
        .toThrow()
    })
  })

  describe('removeTimestamps', () => {
    it('Should remove timestamps of format [dd:dd:dd]', () => {
      expect(removeTimestamps('[00:00:00] This is a test.'))
        .toBe('This is a test.')
      expect(removeTimestamps('This [00:00:00] is a test.'))
        .toBe('This is a test.')
      expect(removeTimestamps('Again, [00:00:00] this is a test.'))
        .toBe('Again, this is a test.')
      expect(removeTimestamps('This is a test [00:00:00].'))
        .toBe('This is a test.')
      expect(removeTimestamps('This is a test.[00:00:00]'))
        .toBe('This is a test.')
    })
    it('Should not remove references to time', () => {
      expect(removeTimestamps('I jumped around at 10:00:00 PM'))
        .toBe('I jumped around at 10:00:00 PM')
    })
  })

  describe('removeSpeakerReminders', () => {
    it('Should remove speaker reminder inserts', () => {
      expect(removeSpeakerReminders('I just -- JOAN DOE: -- love potatoes so much'))
        .toBe('I just love potatoes so much')
      expect(removeSpeakerReminders('-- JIMMY BLIMMY -- All reports indicate that I am literally on fire'))
        .toBe('All reports indicate that I am literally on fire')
      expect(removeSpeakerReminders('Nobody can eat that many eggs. -- KING JOHN --'))
        .toBe('Nobody can eat that many eggs.')
    })
    it('Should not remove other interjections', () => {
      expect(removeSpeakerReminders('I fear that they -- the clown army -- are going to destroy us all.'))
        .toBe('I fear that they -- the clown army -- are going to destroy us all.')
    })
  })

  describe('removeDescriptors', () => {
    it('Should remove generic descriptors', () => {
      expect(removeDescriptors('(TALKING WITH MOUTH FULL) these pickles are delicious'))
        .toBe('these pickles are delicious')
      expect(removeDescriptors('Here, (THROWS ARTIFICIAL LIMB) take my hand!'))
        .toBe('Here, take my hand!')
      expect(removeDescriptors('Follow me! (JUMPS INTO BRICK WALL)'))
        .toBe('Follow me!')
    })
    it('Should remove voice over indicators', () => {
      expect(removeDescriptors('(voice-over) behold the largest swarm of bees in the world'))
        .toBe('behold the largest swarm of bees in the world')
      expect(removeDescriptors('(voice- over) they turn humans into honey.'))
        .toBe('they turn humans into honey.')
      expect(removeDescriptors('(voice-over) behold the largest swarm of bees in the world. (voice-over) Terrifying.'))
        .toBe('behold the largest swarm of bees in the world. Terrifying.')
      expect(removeDescriptors('(voice- over) they turn humans into honey. (voice-over) Appetizing?'))
        .toBe('they turn humans into honey. Appetizing?')
    })
    it('Should remove telephone indicators', () => {
      expect(removeDescriptors('(via telephone) Hello? who is this? Why do you keep calling me?'))
        .toBe('Hello? who is this? Why do you keep calling me?')
      expect(removeDescriptors('Buzz buzz (via telephone)'))
        .toBe('Buzz buzz')
      expect(removeDescriptors('Buzz buzz (via telephone) (via telephone)'))
        .toBe('Buzz buzz')
    })
    it('Should remove on camera', () => {
      expect(removeDescriptors('BEES (on camera): WE WILL KILL ALL HUMANS!'))
        .toBe('BEES: WE WILL KILL ALL HUMANS!')
    })
    it('Should remove through translator', () => {
      expect(removeDescriptors('HUMAN (through translator): BZZZZzzzzzzzzzzzzzzzz'))
        .toBe('HUMAN: BZZZZzzzzzzzzzzzzzzzz')
    })
    it('Should not remove normal parantheticals', () => {
      expect(removeDescriptors('I am sure it will all be fine (aside from all the problems of course.)'))
        .toBe('I am sure it will all be fine (aside from all the problems of course.)')
    })
    it('Should remove through translated text', () => {
      expect(removeDescriptors('HUMAN (through translated text): The bee, of course, flies anyway.'))
        .toBe('HUMAN: The bee, of course, flies anyway.')
    })
  })

  describe('addBreaksOnSpeakerChange', () => {
    it('Should create line breaks on speaker change', () => {
      expect(addBreaksOnSpeakerChange('DONNA: My name is Donna.  JOHNNA: My name is... Johnna?  Who wrote this.'))
        .toBe('DONNA: My name is Donna.\nJOHNNA: My name is... Johnna?  Who wrote this.')
      expect(addBreaksOnSpeakerChange('JANE: testing. ELIANA JOHNSON, NATIONAL POLITICAL REPORTER, "POLITICO": Testing'))
        .toBe('JANE: testing.\nELIANA JOHNSON, NATIONAL POLITICAL REPORTER, "POLITICO": Testing')
    })
    it('Should not create line breaks for one speaker', () => {
      expect(addBreaksOnSpeakerChange('DONNA: Whoever it is they seem to be running out of ideas.'))
        .toBe('DONNA: Whoever it is they seem to be running out of ideas.')
    })
    it('Should not create line breaks for all-caps words', () => {
      expect(addBreaksOnSpeakerChange('PROGRAMMER: LOOK. WHAT DO YOU EXPECT.'))
        .toBe('PROGRAMMER: LOOK. WHAT DO YOU EXPECT.')
    })
    it('Should not include quotes from previous lines', () => {
      expect(addBreaksOnSpeakerChange('"This is a quote." DONNA: Whoever it is they seem to be running out of ideas.'))
        .toBe('"This is a quote."\nDONNA: Whoever it is they seem to be running out of ideas.')
    })
    it('Should allow for hyphens in affiliations', () => {
      expect(addBreaksOnSpeakerChange('Testing this. SEN. ELIZABETH WARREN (D-MA), PRESIDENTIAL CANDIDATE: I do and if you know you think about the sorrow'))
        .toBe('Testing this.\nSEN. ELIZABETH WARREN (D-MA), PRESIDENTIAL CANDIDATE: I do and if you know you think about the sorrow')
    })
    it('Should allow for apostrophes in affiliations', () => {
      expect(addBreaksOnSpeakerChange('(BEGIN VIDEOTAPE) BETO O\'ROURKE (D-TX), PRESIDENTIAL CANDIDATE: Yes.'))
        .toBe('(BEGIN VIDEOTAPE)\nBETO O\'ROURKE (D-TX), PRESIDENTIAL CANDIDATE: Yes.')
    })
  })

  describe('splitTranscriptIntoChunks', () => {
    it('Should split a transcript into chunks', () => {
      expect(splitTranscriptIntoChunks('DONNA: My name is Donna.\nJOHNNA: My name is... Johnna?  Who wrote this.'))
        .toEqual([
          'DONNA: My name is Donna.',
          'JOHNNA: My name is... Johnna?  Who wrote this.',
        ])
    })
  })

  describe('getAttributionFromChunk', () => {
    it('Should extract the attribution from a chunk', () => {
      expect(getAttributionFromChunk('DONNA: My name is Donna.'))
        .toEqual('DONNA')
      expect(getAttributionFromChunk('DONNA, SLAYER OF CAKES: My name is Donna.'))
        .toEqual('DONNA, SLAYER OF CAKES')
      expect(getAttributionFromChunk('REV. AL SHARPTON (D), PRESIDENTIAL CANDIDATE: Schwarzenegger is an impostor. You will see at the end of this that I\'m the real Terminator. I want to terminate Bush.'))
        .toEqual('REV. AL SHARPTON (D), PRESIDENTIAL CANDIDATE')
      expect(getAttributionFromChunk('BILL CLINTON, 42ND PRESIDENT OF THE UNITED STATES: Beep beep boop.'))
        .toEqual('BILL CLINTON, 42ND PRESIDENT OF THE UNITED STATES')
    })
    it('Should return an empty attribution if none exists', () => {
      expect(getAttributionFromChunk('This has no attribution'))
        .toEqual('')
    })
    it('Should not return non-attributions', () => {
      expect(getAttributionFromChunk('ATTRIBUTION: this is: not an attribution: and neither is this.'))
        .toEqual('ATTRIBUTION')
      expect(getAttributionFromChunk('this is: not an attribution: and neither is this.'))
        .toEqual('')
    })
  })

  describe('getTextFromChunk', () => {
    it('Should extract the statement from a chunk', () => {
      expect(getTextFromChunk('DONNA: My name is Donna.'))
        .toEqual('My name is Donna.')
      expect(getTextFromChunk('DONNA, SLAYER OF CAKES: My name is Donna.'))
        .toEqual('My name is Donna.')
    })
  })

  describe('getNameFromAttribution', () => {
    it('Should extract the name from an attribution', () => {
      expect(getNameFromAttribution('DONNA'))
        .toEqual('DONNA')
      expect(getNameFromAttribution('DONNA LITTLE'))
        .toEqual('DONNA LITTLE')
      expect(getNameFromAttribution('DONNA, SLAYER OF CAKES'))
        .toEqual('DONNA')
      expect(getNameFromAttribution('DONNA LITTLE, SLAYER OF CAKES'))
        .toEqual('DONNA LITTLE')
      expect(getNameFromAttribution('BILL CLINTON, 42ND PRESIDENT OF THE UNITED STATES'))
        .toEqual('BILL CLINTON')
    })
    it('Should return an empty name if there is no attribution', () => {
      expect(getNameFromAttribution(''))
        .toEqual('')
    })
    it('Should extract names with apostrophes', () => {
      expect(getNameFromAttribution('BETO O\'ROURKE (D), PRESIDENTIAL CANDIDATE'))
        .toEqual('BETO O\'ROURKE')
    })
    it('Should extract names with hyphens', () => {
      expect(getNameFromAttribution('GOV. STEVE BULLOCK (D-MT), PRESIDENTIAL CANDIDATE'))
        .toEqual('GOV. STEVE BULLOCK')
    })
  })

  describe('getAffiliationFromAttribution', () => {
    it('Should extract the affiliation from an attribution if one exists', () => {
      expect(getAffiliationFromAttribution('DONNA, SLAYER OF CAKES'))
        .toEqual('SLAYER OF CAKES')
      expect(getAffiliationFromAttribution('DONNA LITTLE, SLAYER OF CAKES'))
        .toEqual('SLAYER OF CAKES')
      expect(getAffiliationFromAttribution('DONNA LITTLE, SLAYER OF "CAKES"'))
        .toEqual('SLAYER OF "CAKES"')
      expect(getAffiliationFromAttribution('DONNA LITTLE, SLAYER OF "CAKES" (RETIRED)'))
        .toEqual('SLAYER OF "CAKES" (RETIRED)')
      expect(getAffiliationFromAttribution('BILL CLINTON, 42ND PRESIDENT OF THE UNITED STATES'))
        .toEqual('42ND PRESIDENT OF THE UNITED STATES')
    })
    it('Should return an empty affiliation if there is no affiliation', () => {
      expect(getAffiliationFromAttribution('DONNA'))
        .toEqual('')
      expect(getAffiliationFromAttribution('DONNA LITTLE'))
        .toEqual('')
    })
    it('Should return an empty affiliation if there is no attribution', () => {
      expect(getAffiliationFromAttribution(''))
        .toEqual('')
    })
  })

  describe('extractStatementFromChunk', () => {
    it('Should convert a chunk into a statement', () => {
      expect(extractStatementFromChunk('DONNA: My name is Donna.'))
        .toEqual({
          speaker: {
            extractedName: 'DONNA',
            affiliation: '',
            normalizedName: 'DONNA',
          },
          text: 'My name is Donna.',
        })
      expect(extractStatementFromChunk('DONNA, CNN ANCHOR: My name is Donna.'))
        .toEqual({
          speaker: {
            extractedName: 'DONNA',
            affiliation: 'CNN ANCHOR',
            normalizedName: 'DONNA',
          },
          text: 'My name is Donna.',
        })
    })
  })

  describe('extractStatementsFromChunks', () => {
    it('Should convert chunks into statements', () => {
      expect(extractStatementsFromChunks([
        'DONNA, MASTER OF HIDE AND SEEK: My name is Donna.',
        'JOHNNA, FRIEND OF SQUIRRELS: My name is... Johnna?  Who wrote this.',
      ]))
        .toEqual([{
          speaker: {
            extractedName: 'DONNA',
            affiliation: 'MASTER OF HIDE AND SEEK',
            normalizedName: 'DONNA',
          },
          text: 'My name is Donna.',
        }, {
          speaker: {
            extractedName: 'JOHNNA',
            affiliation: 'FRIEND OF SQUIRRELS',
            normalizedName: 'JOHNNA',
          },
          text: 'My name is... Johnna?  Who wrote this.',
        }])
    })
  })

  describe('getSpeakersFromStatements', () => {
    it('Should return a list of unique speakers', () => {
      expect(getSpeakersFromStatements([{
        speaker: {
          extractedName: 'DONNA',
          affiliation: '',
          normalizedName: 'DONNA',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          extractedName: 'JOHNNA',
          affiliation: '',
          normalizedName: 'JOHNNA',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          extractedName: 'DONNA',
          affiliation: '',
          normalizedName: 'DONNA',
        },
        text: 'I did.',
      }, {
        speaker: {
          extractedName: 'JOHNNA',
          affiliation: 'CLONE OF JOHNNA',
          normalizedName: 'JOHNNA',
        },
        text: 'My name is... also Johnna?',
      }]))
        .toEqual([{
          extractedName: 'DONNA',
          affiliation: '',
          normalizedName: 'DONNA',
        }, {
          extractedName: 'JOHNNA',
          affiliation: '',
          normalizedName: 'JOHNNA',
        }, {
          extractedName: 'JOHNNA',
          affiliation: 'CLONE OF JOHNNA',
          normalizedName: 'JOHNNA',
        }])
    })
  })

  describe('cleanSpeakerName', () => {
    it('Should remove honorifics', () => {
      expect(cleanSpeakerName('SENATOR JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('SEN. JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('REPRESENTATIVE JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('REP. JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('FMR. REP. JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('MAYOR JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('GENERAL JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('GEN. JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('FMR. GENERAL JIMMY DUST'))
        .toBe('JIMMY DUST')
      expect(cleanSpeakerName('SONIA SOTOMAYOR'))
        .toBe('SONIA SOTOMAYOR')
      expect(cleanSpeakerName('FORMER SENATOR GARY FORMERPERSON'))
        .toBe('GARY FORMERPERSON')
    })
  })

  describe('cleanStatementSpeakerNames', () => {
    it('Should remove honorifics', () => {
      expect(cleanStatementSpeakerNames([{
        speaker: {
          extractedName: 'REPRESENTATIVE DONNA BUTTERS',
          affiliation: '',
          normalizedName: 'DONNA BUTTERS',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          extractedName: 'SEN. JOHNNA',
          affiliation: '',
          normalizedName: 'JOHNNA',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          extractedName: 'SENATOR JOHNNA',
          affiliation: '',
          normalizedName: 'JOHNNA',
        },
        text: 'Turns out I am a senator',
      }]))
        .toEqual([{
          speaker: {
            extractedName: 'REPRESENTATIVE DONNA BUTTERS',
            affiliation: '',
            normalizedName: 'DONNA BUTTERS',
          },
          text: 'My name is Donna.',
        }, {
          speaker: {
            extractedName: 'SEN. JOHNNA',
            affiliation: '',
            normalizedName: 'JOHNNA',
          },
          text: 'My name is... Johnna?  Who wrote this.',
        }, {
          speaker: {
            extractedName: 'SENATOR JOHNNA',
            affiliation: '',
            normalizedName: 'JOHNNA',
          },
          text: 'Turns out I am a senator',
        }])
    })
  })

  describe('hasIdenticalName', () => {
    it('Should properly identify speakers with identical names', () => {
      expect(hasIdenticalName({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'BLORP',
      }))
        .toBe(true)
    })
    it('Should properly identify non-identical names', () => {
      expect(hasIdenticalName({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA THE SECOND',
        affiliation: '',
      }))
        .toBe(false)
    })
  })

  describe('improvesName', () => {
    it('Should properly identify speakers with improved names', () => {
      expect(improvesName({
        normalizedName: 'DON DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'BLORP',
      }))
        .toBe(true)
      expect(improvesName({
        normalizedName: 'DON DON DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'BLORP',
      }))
        .toBe(true)
    })
    it('Should properly not identify speakers with not improved names', () => {
      expect(improvesName({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: '',
      }))
        .toBe(false)
      expect(improvesName({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA DONNA',
        affiliation: '',
      }))
        .toBe(false)
      expect(improvesName({
        normalizedName: 'JANE THE MASTER',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: '',
      }))
        .toBe(false)
    })
  })

  describe('improvesAffiliation', () => {
    it('Should properly identify improved affiliations', () => {
      expect(improvesAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        normalizedName: 'DONNA',
        affiliation: '',
      }))
        .toBe(true)
      expect(improvesAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        normalizedName: 'KIMBERLY',
        affiliation: '',
      }))
        .toBe(true)
    })
    it('Should properly not identify non-improved affiliations', () => {
      expect(improvesAffiliation({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA THE SECOND',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe(false)
      expect(improvesAffiliation({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA THE SECOND',
        affiliation: '',
      }))
        .toBe(false)
      expect(improvesAffiliation({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA THE SECOND',
        affiliation: '',
      }))
        .toBe(false)
    })
    it('Should not identify improvement if an affiliation exists', () => {
      expect(improvesAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe(false)
    })
  })

  describe('getBestAffiliation', () => {
    it('Should return the original affiliation when names do not improve or equal', () => {
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA JANE',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('JEANS WEARER')
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'PANTRY',
      }, {
        normalizedName: 'DONNA JANE',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('JEANS WEARER')
    })
    it('Should return the best affiliation when names improve or equal', () => {
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        normalizedName: 'DONNA',
        affiliation: '',
      }))
        .toBe('JEANS WEARER')
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('JEANS WEARER')
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: '',
      }, {
        normalizedName: 'JOHN DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
    })
    it('Should not override existing affiliation', () => {
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        normalizedName: 'DONNA DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
      expect(getBestAffiliation({
        normalizedName: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        normalizedName: 'JOHN JOHNNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
    })
  })

  describe('getBestName', () => {
    it('Should return the original name when last names are not shared', () => {
      expect(getBestName({
        normalizedName: 'DONNA JANE',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('DONNA')
      expect(getBestName({
        normalizedName: 'DON DONDON',
        affiliation: 'PANTRY',
      }, {
        normalizedName: 'DON DON',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('DON DON')
    })
    it('Should return the longer name when the endings match', () => {
      expect(getBestName({
        normalizedName: 'DONNA DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        normalizedName: 'DONNA',
        affiliation: '',
      }))
        .toBe('DONNA DONNA')
      expect(getBestName({
        normalizedName: 'DON DON DONNA',
        affiliation: '',
      }, {
        normalizedName: 'DONNA',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('DON DON DONNA')
    })
    it('Should not return shorter names', () => {
      expect(getBestName({
        normalizedName: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        normalizedName: 'DONNA DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('DONNA DONNA')
    })
  })

  describe('getNormalizedSpeaker', () => {
    it('Should use the first full name', () => {
      expect(getNormalizedSpeaker({
        normalizedName: 'JOHN',
        affiliation: '',
      }, [{
        normalizedName: 'JOHNNY JOHN',
        affiliation: 'PORTLAND',
      }, {
        normalizedName: 'JOHN',
        affiliation: 'PHILADEPHIA',
      }, {
        normalizedName: 'JOHN JOHN',
        affiliation: 'BORTLAND',
      }]))
        .toEqual({
          normalizedName: 'JOHNNY JOHN',
          affiliation: 'PORTLAND',
        })
    })
    it('Should use the most complete name', () => {
      expect(getNormalizedSpeaker({
        normalizedName: 'JOHN',
        affiliation: '',
      }, [{
        normalizedName: 'JOHNNY JOHN',
        affiliation: 'PORTLAND',
      }, {
        normalizedName: 'JOHN',
        affiliation: 'PHILADEPHIA',
      }, {
        normalizedName: 'BOB JOHNNY JOHN',
        affiliation: 'BORTLAND',
      }]))
        .toEqual({
          normalizedName: 'BOB JOHNNY JOHN',
          affiliation: 'BORTLAND',
        })
    })
    it('Should use the most complete affiliation', () => {
      expect(getNormalizedSpeaker({
        normalizedName: 'JOHN',
        affiliation: '',
      }, [{
        normalizedName: 'JOHN',
        affiliation: '',
      }, {
        normalizedName: 'JOHN',
        affiliation: 'PHILADEPHIA',
      }]))
        .toEqual({
          normalizedName: 'JOHN',
          affiliation: 'PHILADEPHIA',
        })
    })
    it('Should not drop affiliation', () => {
      expect(getNormalizedSpeaker({
        normalizedName: 'JOHN',
        affiliation: 'PHILADELPHIA',
      }, [{
        normalizedName: 'JOHN',
        affiliation: '',
      }, {
        normalizedName: 'JOHN',
        affiliation: 'WISCONSON',
      }]))
        .toEqual({
          normalizedName: 'JOHN',
          affiliation: 'PHILADELPHIA',
        })
      expect(getNormalizedSpeaker({
        normalizedName: 'JOHN',
        affiliation: 'PHILADELPHIA',
      }, [{
        normalizedName: 'JOHN',
        affiliation: '',
      }, {
        normalizedName: 'JOHN JOHN',
        affiliation: 'WISCONSON',
      }]))
        .toEqual({
          normalizedName: 'JOHN JOHN',
          affiliation: 'PHILADELPHIA',
        })
    })
  })

  describe('normalizeStatementSpeakers', () => {
    it('Should replace names with long names', () => {
      expect(normalizeStatementSpeakers([{
        speaker: {
          normalizedName: 'DONNA BUTTERS',
          affiliation: 'CNN HOST',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          normalizedName: 'LANCE',
          affiliation: '',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          normalizedName: 'BUTTERS',
          affiliation: '',
        },
        text: 'lol idk.',
      }, {
        speaker: {
          normalizedName: 'JOHNNA LANCE',
          affiliation: 'CNN TOAST',
        },
        text: 'does this even matter?',
      }]))
        .toEqual([{
          speaker: {
            normalizedName: 'DONNA BUTTERS',
            affiliation: 'CNN HOST',
          },
          text: 'My name is Donna.',
        }, {
          speaker: {
            normalizedName: 'JOHNNA LANCE',
            affiliation: 'CNN TOAST',
          },
          text: 'My name is... Johnna?  Who wrote this.',
        }, {
          speaker: {
            normalizedName: 'DONNA BUTTERS',
            affiliation: 'CNN HOST',
          },
          text: 'lol idk.',
        }, {
          speaker: {
            normalizedName: 'JOHNNA LANCE',
            affiliation: 'CNN TOAST',
          },
          text: 'does this even matter?',
        }])
    })
  })

  describe('removeNetworkAffiliatedStatements', () => {
    it('Should remove CNN affiliates', () => {
      expect(removeNetworkAffiliatedStatements([{
        speaker: {
          extractedName: 'DONNA BUTTERS',
          affiliation: 'CNN TALKING HEAD',
          normalizedName: 'DONNA BUTTERS',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          extractedName: 'JOHNNA',
          affiliation: 'CNN PANTS HIDER',
          normalizedName: 'JOHNNA',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          extractedName: 'DONNA',
          affiliation: 'OTHER PERSON',
          normalizedName: 'DONNA',
        },
        text: 'lol idk.',
      }]))
        .toEqual([{
          speaker: {
            extractedName: 'DONNA',
            affiliation: 'OTHER PERSON',
            normalizedName: 'DONNA',
          },
          text: 'lol idk.',
        }])
    })
  })

  describe('removeUnattributableStatements', () => {
    it('Should remove unidentified speaker statements', () => {
      expect(removeUnattributableStatements([{
        speaker: {
          extractedName: 'UNIDENTIFIED MALE',
          affiliation: '',
        },
        text: 'Nobody knows who I am',
      }, {
        speaker: {
          extractedName: 'UNIDENTIFIED FEMALE',
          affiliation: '',
        },
        text: 'Same here.',
      }, {
        speaker: {
          extractedName: 'UNIDENTIFIED ANIMAL',
          affiliation: 'FARM',
        },
        text: 'Moo.',
      }, {
        speaker: {
          extractedName: 'ANIMAL EXPERT',
          affiliation: '',
        },
        text: 'Wait I think that last one was a cow.',
      }]))
        .toEqual([{
          speaker: {
            extractedName: 'ANIMAL EXPERT',
            affiliation: '',
          },
          text: 'Wait I think that last one was a cow.',
        }])
    })
  })
})
