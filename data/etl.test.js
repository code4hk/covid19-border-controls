/* global describe,test,expect */
import _ from 'lodash'
import { allSampleRecords } from './data.fixture'
import { parseViewModelByCountryCodeAndMessages, parseRecordWithMessagesByLocale, createLoadFactoryByKey, parseRecord } from './etl'
describe('use latest record to display', () => {
  test('#parseRecord', () => {
    expect(_.isDate(parseRecord({ startDate: '2020/3/7' }).startDate)).toEqual(true)
    expect(_.isDate(parseRecord({ startDate: null }).startDate)).toEqual(true)
    expect(parseRecord(allSampleRecords[3]).type).toEqual('advisory')
  })

  test('#parseRecordWithMessagesByLocale', () => {
    const { messagesByLocale } = parseRecordWithMessagesByLocale(parseRecord(allSampleRecords[0]))
    expect(_.get(messagesByLocale, 'zh-TW')['tw.hk.20200205.title']).toEqual('測試一')
  })

  test('#parseRecordWithMessagesByLocale trim', () => {
    const { messagesByLocale } = parseRecordWithMessagesByLocale(parseRecord(allSampleRecords[3]))
    // TODO
    // expect(_.get(messagesByLocale, 'zh-TW')['sg.cn.20200207.title'].split('\n').length).toEqual(3)
  })

  test('#parseViewModelByCountryCodeAndMessages', async () => {
    const { viewModelByCountryCode: vm, messagesByLocale } = parseViewModelByCountryCodeAndMessages(allSampleRecords)
    expect(_.get(vm, 'TW.HK.homeCountryCode')).toEqual('TW')
    expect(_.isEmpty(_.get(messagesByLocale, 'en'))).toEqual(false)
    expect(_.isEmpty(_.get(messagesByLocale, 'zh-TW'))).toEqual(false)
    expect(_.isString(_.get(messagesByLocale, 'zh-TW.tw.hk.20200207.title'))).toEqual(false)
  })
})
describe('@data external ', () => {
  test('#createLoadFactoryByKey tw-cdc', async () => {
    const fetch = createLoadFactoryByKey('tw-cdc')
    const data = await fetch()
    const { viewModelByCountryCode, messagesByLocale } = data
    console.log('tw cdc data parsed', viewModelByCountryCode)
    expect(viewModelByCountryCode.TW.SG.ISO3166).toEqual('SG')
    expect(viewModelByCountryCode.TW.SG.severity).toEqual(2)
    expect(viewModelByCountryCode.TW.SG['titleZh-TW']).toEqual('第二級:警示(Alert) 對當地採取加強防護')

    expect(messagesByLocale['zh-TW']['tw-cdc.tw.sg.20200315.title']).toEqual('第二級:警示(Alert) 對當地採取加強防護')
  }, 10 * 1000)

  test('#createLoadFactoryByKey gsheet', async () => {
    const fetch = createLoadFactoryByKey('gsheet')
    const data = await fetch()
    const { viewModelByCountryCode, messagesByLocale } = data
    // console.log('gsheet data parsed', viewModelByCountryCode)
    expect(_.isString(viewModelByCountryCode.TW.HK['titleZh-TW'])).toEqual(true)
    expect(_.isEmpty(viewModelByCountryCode)).toEqual(false)
    expect(_.isEmpty(messagesByLocale)).toEqual(false)
  }, 10 * 1000)
})
