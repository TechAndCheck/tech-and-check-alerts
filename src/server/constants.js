export const ENV_NAMES = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
}

export const CLAIMBUSTER_THRESHHOLD = 0.5

// Every property of this object should have a corresponding property on `STATEMENT_SCRAPER_NAMES`
export const CLAIM_PLATFORM_NAMES = {
  CNN_TRANSCRIPT: 'CNN',
}

// Keys should be lower-case to match the value we pull from the URL and store in the database
export const CNN_SHOW_NAMES = {
  acd: 'Anderson Cooper 360 Degrees',
  ampr: 'CNN\'s Amanpour',
  ath: 'At This Hour',
  cg: 'The Lead With Jake Tapper',
  cnnt: 'CNN Tonight',
  cnr: 'CNN Newsroom',
  crn: 'CNN Right Now',
  csr: 'CNN Special Reports',
  ctw: 'Connect The World',
  ebo: 'Erin Burnett Outfront',
  es: 'Early Start',
  fzgps: 'Fareed Zakaria GPS',
  ip: 'Inside Politics',
  nday: 'New Day',
  ndaysat: 'New Day Saturday',
  ndaysun: 'New Day Sunday',
  nwsm: 'News Stream',
  qmb: 'Quest Means Business',
  rs: 'Reliable Sources',
  se: 'Special Event',
  sitroom: 'The Situation Room',
  smer: 'Smerconish',
  sn: 'CNN 10',
  sotu: 'State of the Union',
  vssg: 'Vital Signs With Dr. Sanjay Gupta',
  wolf: 'Wolf',
  wrn: 'World Right Now With Hala Gorani',
}
