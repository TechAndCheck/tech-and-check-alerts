import NationalNewsletter from '../../newsletters/NationalNewsletter'

export default async () => {
  const newsletter = new NationalNewsletter()
  const sendResults = await newsletter.send()
  return sendResults
}
