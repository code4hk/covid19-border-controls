/* global describe,test,expect */
import _ from 'lodash'
import { allSampleRecords } from '../data/data.fixture'
import { parseI18nViewRecords } from './react-data-container'
describe('use latest record to display', () => {
  test('#parseI18nViewRecords', async () => {
    const { viewModelByCountryCode, messagesByLocale } = parseViewModelByCountryCodeAndMessages(allSampleRecords)
    const viewRecords = parseI18nViewRecords(viewModelByCountryCode, 'zh-TW')
    console.log('parseI18nViewRecords', JSON.stringify(viewRecords, null, 4))
    expect(_.get(viewRecords, '1.0')).toEqual('SG')
    expect(_.get(viewRecords, '1.1.0.0')).toEqual('HK')
    expect(_.get(viewRecords, '1.1.0.1.flag')).toEqual('🇭🇰')
    expect(_.get(viewRecords, '1.1.1.0')).toEqual('CN')
  })
})
