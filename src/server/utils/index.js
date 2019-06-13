import config from '../config'
import { ENV_NAMES } from '../constants'

export const isDevelopmentEnv = () => config.NODE_ENV === ENV_NAMES.DEVELOPMENT
export const isTestEnv = () => config.NODE_ENV === ENV_NAMES.TEST
export const isProductionEnv = () => config.NODE_ENV === ENV_NAMES.PRODUCTION
