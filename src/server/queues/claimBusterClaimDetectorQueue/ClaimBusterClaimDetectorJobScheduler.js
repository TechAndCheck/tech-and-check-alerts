import ClaimBusterClaimDetectorQueueFactory from './ClaimBusterClaimDetectorQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new ClaimBusterClaimDetectorQueueFactory()

class ClaimBusterClaimDetectorJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.None

  getQueue = () => getQueueFactory().getQueue()
}

export default ClaimBusterClaimDetectorJobScheduler
