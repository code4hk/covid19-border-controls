/* global describe,test,expect */
import { allSampleRecords } from './data.fixture'
import { parseViewWithCountryCode } from './index'
describe('use latest record to display', () => {
  test('#parseViewWithCountryCode', async () => {
    const view = parseViewWithCountryCode(allSampleRecords, 'tw')
    expect(view).toEqual(123)
  })
})
