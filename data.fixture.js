// multiple records on same destinations
const baseFixture = {

}

export const sampleTWRecords = [
  {
    homeCountryCode: 'TW',
    targetCountryCode: 'HK',
    titleKey: 'test',
    startDate: '2020/02/05'
  },
  {
    homeCountryCode: 'TW',
    targetCountryCode: 'HK',
    titleKey: 'test',
    startDate: '2020/02/07'
  }
]

export const sampleSGRecords = [
  {
    homeCountryCode: 'SG',
    targetCountryCode: 'HK',
    titleKey: 'teste',
    startDate: '2020/03/05'
  },
  {
    homeCountryCode: 'SG',
    targetCountryCode: 'CN',
    titleKey: 'test',
    startDate: '2020/02/07'
  }
]

export const allSampleRecords = sampleTWRecords.concat(sampleSGRecords)
