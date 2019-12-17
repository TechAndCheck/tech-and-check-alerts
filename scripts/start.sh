# Set up queues
yarn queue:jobs:unschedule
yarn queue:jobs:schedule

# Restart pm2
pm2 start "yarn start"
