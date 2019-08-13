import {
  isTranscriptListUrl,
  isTranscriptUrl,
  getFullCnnUrl,
  removeTimestamps,
  removeSpeakerReminders,
  removeDescriptors,
  addBreaksOnSpeakerChange,
  splitTranscriptIntoChunks,
  getAttributionFromChunk,
  getStatementFromChunk,
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


describe('utils/cnn', () => {
  describe('isTranscriptListUrl', () => {
    it('Should not improperly identify transcript list urls', () => {
      expect(isTranscriptListUrl('http://google.com'))
        .toBe(false)
    })
    it('Should identify transcript list urls', () => {
      expect(isTranscriptListUrl('/TRANSCRIPTS/2019.06.01.html'))
        .toBe(true)
    })
  })

  describe('isTranscriptUrl', () => {
    it('Should not improperly identify transcript urls', () => {
      expect(isTranscriptUrl('http://google.com'))
        .toBe(false)
    })
    it('Should identify transcript list urls', () => {
      expect(isTranscriptUrl('/TRANSCRIPTS/1906/01/cnr.20.html'))
        .toBe(true)
    })
  })

  describe('getFullCnnUrl', () => {
    it('Should not modify a complete url', () => {
      expect(getFullCnnUrl('http://google.com'))
        .toBe('http://google.com')
      expect(getFullCnnUrl('http://cnn.com'))
        .toBe('http://cnn.com')
    })
    it('Should prepend a relative url', () => {
      expect(getFullCnnUrl('TRANSCRIPTS'))
        .toBe('http://cnn.com/TRANSCRIPTS')
    })
    it('Should prepend a relative url starting with /', () => {
      expect(getFullCnnUrl('/TRANSCRIPTS'))
        .toBe('http://cnn.com/TRANSCRIPTS')
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
    it('Should not remove normal parantheticals', () => {
      expect(removeDescriptors('I am sure it will all be fine (aside from all the problems of course.)'))
        .toBe('I am sure it will all be fine (aside from all the problems of course.)')
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
      expect(removeTimestamps('DONNA: Whoever it is they seem to be running out of ideas.'))
        .toBe('DONNA: Whoever it is they seem to be running out of ideas.')
    })
    it('Should not create line breaks for all-caps words', () => {
      expect(removeTimestamps('PROGRAMMER: LOOK. WHAT DO YOU EXPECT.'))
        .toBe('PROGRAMMER: LOOK. WHAT DO YOU EXPECT.')
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

  describe('getStatementFromChunk', () => {
    it('Should extract the statement from a chunk', () => {
      expect(getStatementFromChunk('DONNA: My name is Donna.'))
        .toEqual('My name is Donna.')
      expect(getStatementFromChunk('DONNA, SLAYER OF CAKES: My name is Donna.'))
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
        .toEqual('BETO O\'ROURKE (D)')
    })
    it('Should extract names with hyphens', () => {
      expect(getNameFromAttribution('GOV. STEVE BULLOCK (D-MT), PRESIDENTIAL CANDIDATE'))
        .toEqual('GOV. STEVE BULLOCK (D-MT)')
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
            name: 'DONNA',
            affiliation: '',
          },
          text: 'My name is Donna.',
        })
      expect(extractStatementFromChunk('DONNA, CNN ANCHOR: My name is Donna.'))
        .toEqual({
          speaker: {
            name: 'DONNA',
            affiliation: 'CNN ANCHOR',
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
            name: 'DONNA',
            affiliation: 'MASTER OF HIDE AND SEEK',
          },
          text: 'My name is Donna.',
        }, {
          speaker: {
            name: 'JOHNNA',
            affiliation: 'FRIEND OF SQUIRRELS',
          },
          text: 'My name is... Johnna?  Who wrote this.',
        }])
    })
  })

  describe('getSpeakersFromStatements', () => {
    it('Should return a list of unique speakers', () => {
      expect(getSpeakersFromStatements([{
        speaker: {
          name: 'DONNA',
          affiliation: '',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          name: 'JOHNNA',
          affiliation: '',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          name: 'DONNA',
          affiliation: '',
        },
        text: 'I did.',
      }, {
        speaker: {
          name: 'JOHNNA',
          affiliation: 'CLONE OF JOHNNA',
        },
        text: 'My name is... also Johnna?',
      }]))
        .toEqual([{
          name: 'DONNA',
          affiliation: '',
        }, {
          name: 'JOHNNA',
          affiliation: '',
        }, {
          name: 'JOHNNA',
          affiliation: 'CLONE OF JOHNNA',
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
    })
  })

  describe('cleanStatementSpeakerNames', () => {
    it('Should remove honorifics', () => {
      expect(cleanStatementSpeakerNames([{
        speaker: {
          name: 'REPRESENTATIVE DONNA BUTTERS',
          affiliation: '',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          name: 'SEN. JOHNNA',
          affiliation: '',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          name: 'SENATOR JOHNNA',
          affiliation: '',
        },
        text: 'Turns out I am a senator',
      }]))
        .toEqual([{
          speaker: {
            name: 'DONNA BUTTERS',
            affiliation: '',
          },
          text: 'My name is Donna.',
        }, {
          speaker: {
            name: 'JOHNNA',
            affiliation: '',
          },
          text: 'My name is... Johnna?  Who wrote this.',
        }, {
          speaker: {
            name: 'JOHNNA',
            affiliation: '',
          },
          text: 'Turns out I am a senator',
        }])
    })
  })

  describe('hasIdenticalName', () => {
    it('Should properly identify speakers with identical names', () => {
      expect(hasIdenticalName({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: 'BLORP',
      }))
        .toBe(true)
    })
    it('Should properly identify non-identical names', () => {
      expect(hasIdenticalName({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA THE SECOND',
        affiliation: '',
      }))
        .toBe(false)
    })
  })

  describe('improvesName', () => {
    it('Should properly identify speakers with improved names', () => {
      expect(improvesName({
        name: 'DON DONNA',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: 'BLORP',
      }))
        .toBe(true)
      expect(improvesName({
        name: 'DON DON DONNA',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: 'BLORP',
      }))
        .toBe(true)
    })
    it('Should properly not identify speakers with not improved names', () => {
      expect(improvesName({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: '',
      }))
        .toBe(false)
      expect(improvesName({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA DONNA',
        affiliation: '',
      }))
        .toBe(false)
      expect(improvesName({
        name: 'JANE THE MASTER',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: '',
      }))
        .toBe(false)
    })
  })

  describe('improvesAffiliation', () => {
    it('Should properly identify improved affiliations', () => {
      expect(improvesAffiliation({
        name: 'DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        name: 'DONNA',
        affiliation: '',
      }))
        .toBe(true)
      expect(improvesAffiliation({
        name: 'DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        name: 'KIMBERLY',
        affiliation: '',
      }))
        .toBe(true)
    })
    it('Should properly not identify non-improved affiliations', () => {
      expect(improvesAffiliation({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA THE SECOND',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe(false)
      expect(improvesAffiliation({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA THE SECOND',
        affiliation: '',
      }))
        .toBe(false)
      expect(improvesAffiliation({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA THE SECOND',
        affiliation: '',
      }))
        .toBe(false)
    })
    it('Should not identify improvement if an affiliation exists', () => {
      expect(improvesAffiliation({
        name: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        name: 'DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe(false)
    })
  })

  describe('getBestAffiliation', () => {
    it('Should return the original affiliation when names do not improve or equal', () => {
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA JANE',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('JEANS WEARER')
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: 'PANTRY',
      }, {
        name: 'DONNA JANE',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('JEANS WEARER')
    })
    it('Should return the best affiliation when names improve or equal', () => {
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        name: 'DONNA',
        affiliation: '',
      }))
        .toBe('JEANS WEARER')
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('JEANS WEARER')
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: '',
      }, {
        name: 'JOHN DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
    })
    it('Should not override existing affiliation', () => {
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        name: 'DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        name: 'DONNA DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
      expect(getBestAffiliation({
        name: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        name: 'JOHN JOHNNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('MOST AMAZING PERSON')
    })
  })

  describe('getBestName', () => {
    it('Should return the original name when last names are not shared', () => {
      expect(getBestName({
        name: 'DONNA JANE',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('DONNA')
      expect(getBestName({
        name: 'DON DONDON',
        affiliation: 'PANTRY',
      }, {
        name: 'DON DON',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('DON DON')
    })
    it('Should return the longer name when the endings match', () => {
      expect(getBestName({
        name: 'DONNA DONNA',
        affiliation: 'JEANS WEARER',
      }, {
        name: 'DONNA',
        affiliation: '',
      }))
        .toBe('DONNA DONNA')
      expect(getBestName({
        name: 'DON DON DONNA',
        affiliation: '',
      }, {
        name: 'DONNA',
        affiliation: 'JEANS WEARER',
      }))
        .toBe('DON DON DONNA')
    })
    it('Should not return shorter names', () => {
      expect(getBestName({
        name: 'DONNA',
        affiliation: 'A COOL PERSON',
      }, {
        name: 'DONNA DONNA',
        affiliation: 'MOST AMAZING PERSON',
      }))
        .toBe('DONNA DONNA')
    })
  })

  describe('getNormalizedSpeaker', () => {
    it('Should use the first full name', () => {
      expect(getNormalizedSpeaker({
        name: 'JOHN',
        affiliation: '',
      }, [{
        name: 'JOHNNY JOHN',
        affiliation: 'PORTLAND',
      }, {
        name: 'JOHN',
        affiliation: 'PHILADEPHIA',
      }, {
        name: 'JOHN JOHN',
        affiliation: 'BORTLAND',
      }]))
        .toEqual({
          name: 'JOHNNY JOHN',
          affiliation: 'PORTLAND',
        })
    })
    it('Should use the most complete name', () => {
      expect(getNormalizedSpeaker({
        name: 'JOHN',
        affiliation: '',
      }, [{
        name: 'JOHNNY JOHN',
        affiliation: 'PORTLAND',
      }, {
        name: 'JOHN',
        affiliation: 'PHILADEPHIA',
      }, {
        name: 'BOB JOHNNY JOHN',
        affiliation: 'BORTLAND',
      }]))
        .toEqual({
          name: 'BOB JOHNNY JOHN',
          affiliation: 'BORTLAND',
        })
    })
    it('Should use the most complete affiliation', () => {
      expect(getNormalizedSpeaker({
        name: 'JOHN',
        affiliation: '',
      }, [{
        name: 'JOHN',
        affiliation: '',
      }, {
        name: 'JOHN',
        affiliation: 'PHILADEPHIA',
      }]))
        .toEqual({
          name: 'JOHN',
          affiliation: 'PHILADEPHIA',
        })
    })
    it('Should not drop affiliation', () => {
      expect(getNormalizedSpeaker({
        name: 'JOHN',
        affiliation: 'PHILADELPHIA',
      }, [{
        name: 'JOHN',
        affiliation: '',
      }, {
        name: 'JOHN',
        affiliation: 'WISCONSON',
      }]))
        .toEqual({
          name: 'JOHN',
          affiliation: 'PHILADELPHIA',
        })
      expect(getNormalizedSpeaker({
        name: 'JOHN',
        affiliation: 'PHILADELPHIA',
      }, [{
        name: 'JOHN',
        affiliation: '',
      }, {
        name: 'JOHN JOHN',
        affiliation: 'WISCONSON',
      }]))
        .toEqual({
          name: 'JOHN JOHN',
          affiliation: 'PHILADELPHIA',
        })
    })
  })

  describe('normalizeStatementSpeakers', () => {
    it('Should replace names with long names', () => {
      expect(normalizeStatementSpeakers([{
        speaker: {
          name: 'DONNA BUTTERS',
          affiliation: 'CNN HOST',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          name: 'LANCE',
          affiliation: '',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          name: 'BUTTERS',
          affiliation: '',
        },
        text: 'lol idk.',
      }, {
        speaker: {
          name: 'JOHNNA LANCE',
          affiliation: 'CNN TOAST',
        },
        text: 'does this even matter?',
      }]))
        .toEqual([{
          speaker: {
            name: 'DONNA BUTTERS',
            affiliation: 'CNN HOST',
          },
          text: 'My name is Donna.',
        }, {
          speaker: {
            name: 'JOHNNA LANCE',
            affiliation: 'CNN TOAST',
          },
          text: 'My name is... Johnna?  Who wrote this.',
        }, {
          speaker: {
            name: 'DONNA BUTTERS',
            affiliation: 'CNN HOST',
          },
          text: 'lol idk.',
        }, {
          speaker: {
            name: 'JOHNNA LANCE',
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
          name: 'DONNA BUTTERS',
          affiliation: 'CNN TALKING HEAD',
        },
        text: 'My name is Donna.',
      }, {
        speaker: {
          name: 'JOHNNA',
          affiliation: 'CNN PANTS HIDER',
        },
        text: 'My name is... Johnna?  Who wrote this.',
      }, {
        speaker: {
          name: 'DONNA',
          affiliation: 'OTHER PERSON',
        },
        text: 'lol idk.',
      }]))
        .toEqual([{
          speaker: {
            name: 'DONNA',
            affiliation: 'OTHER PERSON',
          },
          text: 'lol idk.',
        }])
    })
  })

  describe('removeUnattributableStatements', () => {
    it('Should remove unidentified speaker statements', () => {
      expect(removeUnattributableStatements([{
        speaker: {
          name: 'UNIDENTIFIED MALE',
          affiliation: '',
        },
        text: 'Nobody knows who I am',
      }, {
        speaker: {
          name: 'UNIDENTIFIED FEMALE',
          affiliation: '',
        },
        text: 'Same here.',
      }, {
        speaker: {
          name: 'UNIDENTIFIED ANIMAL',
          affiliation: 'FARM',
        },
        text: 'Moo.',
      }, {
        speaker: {
          name: 'ANIMAL EXPERT',
          affiliation: '',
        },
        text: 'Wait I think that last one was a cow.',
      }]))
        .toEqual([{
          speaker: {
            name: 'ANIMAL EXPERT',
            affiliation: '',
          },
          text: 'Wait I think that last one was a cow.',
        }])
    })
  })
})
