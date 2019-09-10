import NorthCarolinaNewsletter from '../../newsletters/NorthCarolinaNewsletter'

export default async () => {
  const newsletter = new NorthCarolinaNewsletter()
  const sendResults = await newsletter.send()
  return sendResults
}
