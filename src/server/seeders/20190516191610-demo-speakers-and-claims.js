module.exports = {
  up: async (queryInterface) => {
    // Generate speakers first, so we have an ID to associate with claims.
    await queryInterface.bulkInsert('speakers', [
      {
        full_name: '[Testing] Ray Boyd',
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
    ], {})

    // Nab the latest speaker ID.
    const speakers = await queryInterface.sequelize.query("SELECT id FROM speakers WHERE full_name LIKE '[Testing]%' ORDER BY id DESC LIMIT 1;")

    // Now, generate our claims and associate with the speaker above.
    return queryInterface.bulkInsert('claims', [
      {
        content: '[Testing] The human head weighs eight pounds.',
        source_url: 'https://www.imdb.com/title/tt0116695/quotes/qt0389281',
        claim_buster_score: 0.05,
        claimed_at: (new Date('13 December 1996').toISOString()),
        speaker_id: speakers[0][0].id,
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    const testSpeakers = await queryInterface.sequelize.query("SELECT id FROM speakers WHERE full_name LIKE '[Testing]%';")
    const testSpeakersIds = testSpeakers[0].map(speaker => speaker.id)
    // Delete claims first, since they belong to speakers.
    await queryInterface.bulkDelete('claims', {
      speaker_id: {
        [Sequelize.Op.in]: testSpeakersIds,
      },
    }, {})
    await queryInterface.bulkDelete('speakers', {
      id: {
        [Sequelize.Op.in]: testSpeakersIds,
      },
    }, {})
  },
}
