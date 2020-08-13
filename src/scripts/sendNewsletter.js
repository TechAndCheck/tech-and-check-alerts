import logger from '../server/utils/logger'
import models from '../server/models'
import DynamicNewsletterIssueGenerator from '../server/workers/newsletterIssueGenerators/DynamicNewsletterIssueGenerator'

const { Newsletter } = models

const send = async () => {
  const label = process.argv[2].substring(2)
  const newsletter = await Newsletter.findByLabel(label)
  if (!newsletter) {
    logger.error(`Did not send the test newsletter. The ${label} newsletter doesn't exist.`)
    process.exit()
  }
  const issueGenerator = new DynamicNewsletterIssueGenerator(newsletter)
  issueGenerator.send().catch((error) => {
    logger.error(`Did not send the test newsletter. ${error}`)
  }).finally(() => {
    process.exit()
  })
}

send()
