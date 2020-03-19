// multiple records on same destinations
const baseFixture = {

}

export const sampleTWRecords = [
  {
    homeCountryCode: 'TW',
    targetCountryCode: 'HK',
    'titleZh-TW': '測試一',
    titleEn: 'English Desc 1',
    startDate: '2020/02/05',
    type: 'advisory'
  },
  {
    homeCountryCode: 'TW',
    targetCountryCode: 'HK',
    'titleZh-TW': '測試二',
    titleEn: 'English Desc 2',
    startDate: '2020/02/07',
    type: 'advisory'
  },
  {
    homeCountryCode: 'TW',
    targetCountryCode: 'SG',
    'titleZh-TW': '測試一',
    titleEn: 'English Desc 1',
    startDate: '2020/03/05',
    type: 'advisory'
  }
]

export const sampleSGRecords = [
  {
    homeCountryCode: 'SG',
    targetCountryCode: 'HK',
    'titleZh-TW': '測試一',
    titleEn: 'English Desc 1',
    startDate: '2020/03/05',
    type: 'advisory'
  },
  {
    homeCountryCode: 'SG',
    targetCountryCode: 'CN',
    'titleZh-TW': `
    行一

    行三
    `,
    titleEn: 'English Desc 2',
    startDate: '2020/02/07',
    type: 'advisory'
  }
]

export const allSampleRecords = sampleTWRecords.concat(sampleSGRecords).concat([
  {
    homeCountryCode: 'AU',
    targetCountryCode: 'GLOBAL',
    'titleZh-TW': '測試一',
    titleEn: 'GLOBAL',
    startDate: '2020/03/05',
    type: 'advisory'
  }
])
