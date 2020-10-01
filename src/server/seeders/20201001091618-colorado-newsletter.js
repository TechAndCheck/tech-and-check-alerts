import { NEWSLETTER_MEDIA } from '../workers/newsletterIssueGenerators/constants'

module.exports = {
  up: async (queryInterface) => {
    // Generate TwitterAccountLists first, so we have an ID to associate with newsletters.
    const listIds = await queryInterface.bulkInsert('twitter_account_lists', [
      {
        name: 'Colorado',
        google_doc_id: '1AOZXBvxebQJpV7B5gk8Z2J80wOAP9sI9TtPBNdZ5xoE',
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
    ], {
      returning: true,
    })

    // Now, generate our newsletters and associate with the TwitterAccountList.
    return queryInterface.bulkInsert('newsletters', [
      {
        label: 'colorado',
        mailing_list_address: 'colorado@alerts.factstream.co',
        template_name: 'dynamic',
        text_template_name: 'dynamic',
        template_settings: JSON.stringify({
          topBoilerplate: 'Good morning, fact-checkers! This automated Tech & Check Alert features potential claims from selected Colorado Twitter feeds.',
          bottomBoilerplate: `### About This Alert

This daily email is part of an experimental, automated alert service developed by the Duke Reporters’ Lab as part of our Tech & Check Cooperative. The alerts are computer-generated tip sheets designed to help journalists identify statements from the last 24 hours that are newsworthy enough to fact-check. The alerts are for use in your newsrooms and not intended for broader public distribution. No humans on the Tech & Check team reviewed or verified the accuracy of these statements or their attribution before this alert was sent.

The statements above are taken from a list of Twitter feeds maintained by the Reporters’ Lab. It includes elected officials, and state and national party organizations, candidates and interest groups. The alerts are generated using the ClaimBuster algorithm developed by computer scientists at the University of Texas, Arlington. ClaimBuster ranks each statement based on its potential "checkability" -- NOT its accuracy. You can learn more about how that works on the ClaimBuster site ([https://idir.uta.edu/claimbuster/](https://idir.uta.edu/claimbuster/)).

Please send any feedback to Tech & Check project manager Erica Ryan ([elryan@gmail.com](mailto:elryan@gmail.com)).

Best,
**Duke Reporters’ Lab**`,
        }),
        subject_decoration: 'Colorado Politics',
        enabled_media: JSON.stringify([
          NEWSLETTER_MEDIA.SOCIAL,
        ]),
        claim_limit: 50,
        twitter_account_list_id: listIds[0].id,
        created_at: (new Date()).toISOString(),
        updated_at: (new Date()).toISOString(),
      },
    ], {})
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query("DELETE FROM newsletters WHERE label = 'colorado'")
    await queryInterface.sequelize.query("DELETE FROM twitter_account_lists WHERE name = 'Colorado'")
  },
}
