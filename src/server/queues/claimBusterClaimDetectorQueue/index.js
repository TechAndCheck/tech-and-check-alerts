import ClaimBusterClaimDetectorQueueFactory from './ClaimBusterClaimDetectorQueueFactory'
import ClaimBusterClaimDetectorJobScheduler from './ClaimBusterClaimDetectorJobScheduler'
import claimBusterClaimDetectorJobProcessor from './claimBusterClaimDetectorJobProcessor'

export default {
  factory: new ClaimBusterClaimDetectorQueueFactory(),
  scheduler: new ClaimBusterClaimDetectorJobScheduler(),
  processor: claimBusterClaimDetectorJobProcessor,
}
