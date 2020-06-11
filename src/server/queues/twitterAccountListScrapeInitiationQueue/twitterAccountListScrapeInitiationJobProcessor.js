import twitterAccountListScraperQueueDict from '../twitterAccountListScraperQueue'
import { getQueueFromQueueDict } from '../../utils/queue'
import models from '../../models'

const { TwitterAccountList } = models

const twitterAccountListScraperQueue = getQueueFromQueueDict(
  twitterAccountListScraperQueueDict,
)

const scrapeTwitterAccountList = twitterAccountList => twitterAccountListScraperQueue.add({
  twitterAccountListId: twitterAccountList.id,
})

export default async () => {
  const twitterAccountLists = await TwitterAccountList.findAll()
  twitterAccountLists.forEach(scrapeTwitterAccountList)
  return twitterAccountLists
}
