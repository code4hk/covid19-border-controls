// This module responsible
// 1) fetch the data,
// - either automated ajax or load from static build
// 2) determines messages of which locales to be pre-loaded
// dynamic load is not supported
// 3) determine user locale
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { createLoadFactoryByKey } from '../data/etl'
import { mapCountryCodeAsEmoji } from '../i18n'
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl'

export const parseI18nViewRecords = (viewModelByCountryCode) => {
  // decouple view keys & messages data
  return _.toPairs(_.mapValues(viewModelByCountryCode, (byTarget, countryCode) => {
    return _.map(
      _.pickBy(byTarget, (targetData) => !!targetData),
      (record, countryCode) => {
        const { severity, type } = record
        return ([countryCode, {
          severity,
          // using this hack instead of messages inside Intl for now
          flag: mapCountryCodeAsEmoji(countryCode),
          type,
          source: record.source,
          sourceUrl: record.sourceUrl,
          titleI18nKey: record.i18nKey + '.title',
          descriptionI18nKey: record.i18nKey + '.description'
        }])
      })
  })
  )
}

export const DataI18nContainer = ({ viewModelByCountryCode, messagesByLocale, currentLocale, locales = ['zh-TW'], children }) => {
  const userLocale = currentLocale || navigator.language
  const locale = _.includes(locales, userLocale) ? userLocale : 'zh-TW'
  const originalMessages = require('../messages/' + locale + '.json')
  const messages = {
    ...messagesByLocale[locale],
    ...originalMessages
  }
  console.log('messages', locale, messages)

  const countryRecords = parseI18nViewRecords(viewModelByCountryCode) || []
  return (
    <IntlProvider
      key={locale}
      messages={messages} locale={locale} defaultLocale='zh-TW'
    >
      {React.cloneElement(children, { countryRecords })}
    </IntlProvider>
  )
}

export default ({ currentLocale, locales, children }) => {
  const [viewModelByCountryCode, setViewModelByCountryCode] = React.useState({})
  const [messagesByLocale, setMessagesByLocale] = React.useState({})

  // For now, always use gsheet to override
  // TODO priority systems
  const mergeData = ({ viewModelByCountryCode, messagesByLocale }) => {
    setViewModelByCountryCode(viewModelByCountryCode)
    setMessagesByLocale(messagesByLocale
    )
  }

  useEffect(() => {
    (async () => {
      // simplify priority so not // req
      const dataGsheet = await createLoadFactoryByKey('gsheet')()
      const dataTwCdc = await createLoadFactoryByKey('tw-cdc')()
      mergeData(_.merge(
        {},
        dataTwCdc,
        dataGsheet
      ))
    })()
  }, [])
  if (!children) {
    return <></>
  }
  return (
    <DataI18nContainer
      locales={locales}
      viewModelByCountryCode={viewModelByCountryCode}
      currentLocale={currentLocale}
      messagesByLocale={messagesByLocale}
    >{children}
    </DataI18nContainer>
  )
}
