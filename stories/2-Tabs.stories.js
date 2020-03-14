import _ from 'lodash'
import React, { useState } from 'react'
import DataContainer from '../ui/react-data-container'
import CountryTabs from '../ui/react-country-tabs'
import CountryTable from '../ui/react-country-table'
import { FormattedMessage } from 'react-intl'
import Box from '@material-ui/core/Box'
import { defaultLocales } from '../i18n'

export default {
  title: 'CountryTabs'
}

const localesEnabled = defaultLocales

const CountryTabsWithLanguageSelector = ({ countryRecords, setLocale }) => {
  return (
    <>
      <Box display='flex' justify='center' alignItems='center'>
        {
          localesEnabled.map(l => (
            <div
              key={l}
              style={{
                'text-decoration': 'underline',
                cursor: 'pointer'
              }} onClick={() => {
                setLocale(l)
              }}
            ><FormattedMessage id={'language.native.' + l} />
            </div>)
          )
            .reduce((prev, curr) => (prev ? [prev, ' - ', curr] : [curr]), null)
        }
      </Box>
      <CountryTabs countryRecords={countryRecords} />
    < />
  )
}

export const DataLoadingCountryTabs = () => {
  const [locale, setLocale] = useState('zh-TW')
  return (
    <>
      <DataContainer locales={localesEnabled} currentLocale={locale}>
        <CountryTabsWithLanguageSelector setLocale={setLocale} />
      </DataContainer>
    </>
  )
}

const TWTable = ({ countryRecords }) => {
  const countryRecord = _.find(countryRecords, ([countryCode, data]) => {
    return countryCode === 'TW'
  })
  if (!countryRecord) {
    return <></>
  }
  return <CountryTable rows={countryRecord[1]} />
}

export const DataLoadingTable = () => (
  <DataContainer currentLocale='en'>
    <TWTable />
  </DataContainer>
)
