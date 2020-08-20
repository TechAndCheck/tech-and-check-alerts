import { NEWSLETTER_MEDIA } from '../workers/newsletterIssueGenerators/constants'

module.exports = {
  up: async (queryInterface) => {
    // Generate TwitterAccountLists first, so we have an ID to associate with newsletters.
    const listIds = await queryInterface.bulkInsert('twitter_account_lists', [
      {
        name: 'North Carolina',
        google_doc_id: '1Z7grw_GQLNMtSVvkUtbXatly_JId7h3yVDX9BWyJetg',
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
      {
        name: 'National',
        google_doc_id: '1gLkx2LK3yhS-glpsktWYNqBc9H2zsd7C6TvmgWjL5Kg',
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
      {
        name: 'Minnesota',
        google_doc_id: '1mtCKouAACjnil8Z9BdULaw-7YYes3MD5dpm8lp4n-p0',
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
    ], {
      returning: true,
    })

    // Now, generate our newsletters and associate with the TwitterAccountList.
    return queryInterface.bulkInsert('newsletters', [
      {
        label: 'north_carolina',
        mailing_list_address: 'dev@alerts.factstream.co',
        template_name: 'dynamic',
        text_template_name: 'dynamic',
        template_settings: JSON.stringify({
          topBoilerplate: 'Good morning, fact-checkers! This automated Tech & Check Alert features potential claims from selected North Carolina Twitter feeds.',
          bottomBoilerplate: `### About This Alert

This daily email is part of an experimental, automated alert service developed by the Duke Reporters’ Lab as part of our Tech & Check Cooperative. The alerts are computer-generated tip sheets designed to help journalists identify statements from the last 24 hours that are newsworthy enough to fact-check. The alerts are for use in your newsrooms and not intended for broader public distribution. No humans on the Tech & Check team reviewed or verified the accuracy of these statements or their attribution before this alert was sent.

The statements above are taken from a list of Twitter feeds maintained by the Reporters’ Lab. It includes elected officials, and state and national party organizations, candidates and interest groups. The alerts are generated using the ClaimBuster algorithm developed by computer scientists at the University of Texas, Arlington. ClaimBuster ranks each statement based on its potential "checkability" -- NOT its accuracy. You can learn more about how that works on the ClaimBuster site ([https://idir.uta.edu/claimbuster/](https://idir.uta.edu/claimbuster/)).

Please send any feedback to Tech & Check project manager Erica Ryan ([elryan@gmail.com](mailto:elryan@gmail.com)).

Best,
**Duke Reporters’ Lab**`,
        }),
        subject_decoration: 'NC Politics',
        enabled_media: JSON.stringify([
          NEWSLETTER_MEDIA.SOCIAL,
        ]),
        claim_limit: 50,
        twitter_account_list_id: listIds[0].id,
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
      {
        label: 'national',
        mailing_list_address: 'dev@alerts.factstream.co',
        template_name: 'dynamic',
        text_template_name: 'dynamic',
        template_settings: JSON.stringify({
          topBoilerplate: 'Good morning, fact-checkers! This Tech & Check Alert features potential claims from CNN and Twitter that were identified automatically using the ClaimBuster algorithm.',
          bottomBoilerplate: `### About This Alert

This daily email is part of an experimental, automated alert service developed by the Duke Reporters’ Lab as part of our Tech & Check Cooperative. The alerts are computer-generated tip sheets designed to help journalists identify statements from the last 24 hours that are newsworthy enough to fact-check. The alerts are for use in your newsrooms and not intended for broader public distribution. No humans on the Tech & Check team reviewed or verified the accuracy of these statements or their attribution before this alert was sent.

The statements above from CNN are based on the network's "rush" transcripts. Please verify quotes and speakers by checking the original video. Statements from Twitter were gathered from a selected list of official Twitter accounts, including the feeds of candidates, elected officials and state and national party organizations.

The alerts are generated using the ClaimBuster algorithm developed by computer scientists at the University of Texas, Arlington. ClaimBuster ranks each statement based on its potential "checkability" -- NOT its accuracy. You can learn more about how that works on the ClaimBuster site ([https://idir.uta.edu/claimbuster/](https://idir.uta.edu/claimbuster/)).

Please send any feedback to Tech & Check project manager Erica Ryan ([elryan@gmail.com](mailto:elryan@gmail.com)).

Best,
**Duke Reporters’ Lab**`,
        }),
        subject_decoration: 'National Politics',
        enabled_media: JSON.stringify([
          NEWSLETTER_MEDIA.TV,
          NEWSLETTER_MEDIA.SOCIAL,
        ]),
        claim_limit: 15,
        twitter_account_list_id: listIds[1].id,
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
      {
        label: 'minnesota',
        mailing_list_address: 'dev@alerts.factstream.co',
        template_name: 'dynamic',
        text_template_name: 'dynamic',
        template_settings: JSON.stringify({
          topBoilerplate: 'Good morning, fact-checkers! This automated Tech & Check Alert features potential claims from selected Minnesota Twitter feeds.',
          bottomBoilerplate: `### About This Alert

This daily email is part of an experimental, automated alert service developed by the Duke Reporters’ Lab as part of our Tech & Check Cooperative. The alerts are computer-generated tip sheets designed to help journalists identify statements from the last 24 hours that are newsworthy enough to fact-check. The alerts are for use in your newsrooms and not intended for broader public distribution. No humans on the Tech & Check team reviewed or verified the accuracy of these statements or their attribution before this alert was sent.

The statements above are taken from a list of Twitter feeds maintained by the Reporters’ Lab. It includes elected officials, and state and national party organizations, candidates and interest groups. The alerts are generated using the ClaimBuster algorithm developed by computer scientists at the University of Texas, Arlington. ClaimBuster ranks each statement based on its potential "checkability" -- NOT its accuracy. You can learn more about how that works on the ClaimBuster site ([https://idir.uta.edu/claimbuster/](https://idir.uta.edu/claimbuster/)).

Please send any feedback to Tech & Check project manager Erica Ryan ([elryan@gmail.com](mailto:elryan@gmail.com)).

Best,
**Duke Reporters’ Lab**`,
        }),
        subject_decoration: 'Minnesota Politics',
        enabled_media: JSON.stringify([
          NEWSLETTER_MEDIA.SOCIAL,
        ]),
        claim_limit: 50,
        twitter_account_list_id: listIds[2].id,
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    const testSpeakers = await queryInterface.sequelize.query("DELETE id FROM speakers WHERE full_name LIKE '[Testing]%';")
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
