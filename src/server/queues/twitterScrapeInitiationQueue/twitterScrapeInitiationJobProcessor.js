import twitterAccountStatementScraperQueueDict from '../twitterAccountStatementScraperQueue'
import models from '../../models'
import { getQueueFromQueueDict } from '../../utils/queue'

const { TwitterAccount } = models

const twitterAccountStatementScraperQueue = getQueueFromQueueDict(
  twitterAccountStatementScraperQueueDict,
)

const scrapeTwitterAccount = twitterAccount => twitterAccountStatementScraperQueue.add({
  screenName: twitterAccount.screenName,
})

const getActiveTwitterAccounts = () => TwitterAccount.getActive()

export default async () => {
  const twitterAccounts = await getActiveTwitterAccounts()
  twitterAccounts.forEach(scrapeTwitterAccount)
  return twitterAccounts
}
