export const ENV_NAMES = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
}

export const PLATFORMS = {
  CNN: 'CNN',
  TWITTER: 'TWITTER',
}

export const PLATFORM_NAMES = {
  CNN: 'CNN',
  TWITTER: 'Twitter',
}

export const TWITTER_LIST_NAMES = {
  NATIONAL: 'national',
  NORTH_CAROLINA: 'northCarolina',
}

// TODO - This should NOT be a constant. It should be DB driven. We are
// using a constant temporarily since the dynamic newsletter functionality
// will potentially change the way twitter lists are organized, and didn't
// want to create migrations that will be almost immediately obsolete.
export const TWITTER_LIST_GOOGLE_DOC_ID_MAP = {
  [TWITTER_LIST_NAMES.NATIONAL]: '1gLkx2LK3yhS-glpsktWYNqBc9H2zsd7C6TvmgWjL5Kg',
  [TWITTER_LIST_NAMES.NORTH_CAROLINA]: '1Z7grw_GQLNMtSVvkUtbXatly_JId7h3yVDX9BWyJetg',
}

export const CLAIMBUSTER_THRESHHOLD = 0.5

export const CLAIMBUSTER_API_ROOT_URL = 'https://idir.uta.edu/claimbuster/api/v1'
