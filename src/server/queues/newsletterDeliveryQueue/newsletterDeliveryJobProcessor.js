import DynamicNewsletterIssueGenerator from '../../workers/newsletterIssueGenerators/DynamicNewsletterIssueGenerator'
import models from '../../models'

const { Newsletter } = models

export default async (job) => {
  const {
    data: {
      newsletterId,
    },
  } = job
  const newsletter = await Newsletter.findByPk(newsletterId)
  const issueGenerator = new DynamicNewsletterIssueGenerator(newsletter)
  const sendResults = await issueGenerator.send()
  return sendResults
}
