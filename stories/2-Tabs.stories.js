import _ from 'lodash'
import React from 'react'
import DataContainer from '../ui/react-data-container'
import CountryTabs from '../ui/react-country-tabs'
import CountryTable from '../ui/react-country-table'
export default {
  title: 'CountryTabs'
}

export const DataLoadingCountryTabs = () => (
  <DataContainer currentLocale='en'>
    <CountryTabs />
  </DataContainer>
)

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
