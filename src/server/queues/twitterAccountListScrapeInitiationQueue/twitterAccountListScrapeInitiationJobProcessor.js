import twitterAccountListScraperQueueDict from '../twitterAccountListScraperQueue'
import { getQueueFromQueueDict } from '../../utils/queue'
import { TWITTER_LIST_NAMES } from '../../constants'

const twitterAccountListScraperQueue = getQueueFromQueueDict(
  twitterAccountListScraperQueueDict,
)

const scrapeTwitterAccountList = listName => twitterAccountListScraperQueue.add({
  listName,
})

export default async () => {
  const listNames = Object.entries(TWITTER_LIST_NAMES).map(([, listName]) => listName)
  listNames.forEach(scrapeTwitterAccountList)
  return TWITTER_LIST_NAMES
}
