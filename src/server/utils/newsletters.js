// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */

import { INTERNAL_MAILING_LISTS } from '../newsletters/constants'
import { hasKey } from '.'

export const isInternalMailingList = list => hasKey(INTERNAL_MAILING_LISTS, list)
