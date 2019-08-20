import ClaimBusterClaimDetectorQueueFactory from './ClaimBusterClaimDetectorQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class ClaimBusterClaimDetectorJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new ClaimBusterClaimDetectorQueueFactory()
}

export default ClaimBusterClaimDetectorJobScheduler
