/* global describe,test,expect */
import _ from 'lodash'
import { asObjectRecords } from './react-country-tabs'
import { parseI18nViewRecords } from './react-data-container'
import { parseViewModelByCountryCodeAndMessages, parseRecordWithMessagesByLocale } from '../data/etl'
import { allSampleRecords } from '../data/data.fixture'
describe('use latest record to display', () => {
  test('#asObjectRecords', async () => {
    const { viewModelByCountryCode, messagesByLocale } = parseViewModelByCountryCodeAndMessages(allSampleRecords)
    const viewRecords = asObjectRecords(parseI18nViewRecords(viewModelByCountryCode, 'zh-TW'))
    console.log('viewRecords', JSON.stringify(viewRecords, null, 4))
    const recordByCountryCode = _.fromPairs(viewRecords)
    expect(_.get(recordByCountryCode.SG, '0.0')).toEqual('TW')
    expect(_.get(recordByCountryCode.TW, '0.0')).toEqual('AU')
    // exinclude itself
    expect(_.isEmpty(recordByCountryCode.AU)).toEqual(true)
  })
})
