import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class ClaimBusterClaimDetectorQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.claimDetectorQueues.CLAIM_BUSTER

  getPathToProcessor = () => `${__dirname}/claimBusterClaimDetectorJobProcessor.js`
}

export default ClaimBusterClaimDetectorQueueFactory
