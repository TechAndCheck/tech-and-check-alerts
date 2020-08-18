import newsletterDeliveryQueueDict from '../newsletterDeliveryQueue'
import models from '../../models'
import { getQueueFromQueueDict } from '../../utils/queue'

const { Newsletter } = models

const newsletterDeliveryQueue = getQueueFromQueueDict(
  newsletterDeliveryQueueDict,
)

const deliverNewsletter = newsletter => newsletterDeliveryQueue.add({
  newsletterId: newsletter.id,
})

const getNewsletters = () => Newsletter.findAll()

export default async () => {
  const newsletters = await getNewsletters()
  newsletters.forEach(deliverNewsletter)
  return newsletters
}
