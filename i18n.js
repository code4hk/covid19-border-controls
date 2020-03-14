import _ from 'lodash'
import React from 'react'
import { FormattedMessage } from 'react-intl'

export const defaultLocales = ['zh-TW', 'en', 'ja', 'ko']

export const mapCountryCodeAsEmoji = (countryCode = '') => {
  if (countryCode.length !== 2) {
    return '🌎'
  }
  return countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

// TODO declare supported locales
export const getCountryLabel = countryCode => (
  <>
    {mapCountryCodeAsEmoji(countryCode)}
    <FormattedMessage id={'country.' + _.toLower(countryCode)} />
  </>
)
