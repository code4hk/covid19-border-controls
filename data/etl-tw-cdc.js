import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import { format, parse, parseISO } from 'date-fns'
const TW_ROC_DATA_PATH = 'https://yacdn.org/serve/https://www.cdc.gov.tw/CountryEpidLevel/ExportJSON'
const removeBOM = s => (s || '').replace(/[\t\n\r\f\uFEFF]/gm, '')

const fetchData = async () => {
  // res is stream based, need to parse as text
  const jsonString = await fetch(TW_ROC_DATA_PATH, {
    headers: { }
  })
    .then(res => res.text())

  return JSON.parse(removeBOM(jsonString) || '{}')
}

// don't rely on record.ISO3166_2 https://github.com/code4hk/covid19-border-controls/issues/1
// effective is always the current Date, not truly startDate. good enough for current viz though
// TODO handle expires
// https://www.cdc.gov.tw/CountryEpidLevel/Index/NlUwZUNvckRWQ09CbDJkRVFjaExjUT09
export const parseRecords = async (records) => {
  return records.map(
    r => {
      let severity = 1
      let titleEn = 'Travel Notice Level 1: Watch'
      // TODO clarify quarantine vs advisory relationship at TW ROC
      if (r.severity_level.match(/第二級/)) {
        severity = 2
        titleEn = 'Travel Notice Level 2: Alert'
      }
      if (r.severity_level.match(/第三級/)) {
        severity = 3
        titleEn = 'Travel Notice Level 3: Warning'
      }

      return {
        severity,
        source: '疾病管制署',
        sourceUrl: r.web,
        homeCountryCode: 'TW',
        targetCountryCode: r.ISO3166,
        type: 'advisory',
        startDate: parseISO(r.effective),
        titleEn,
        'titleZh-TW': r.severity_level + ' ' + r.instruction,
        ...r
      }
    }
  )
}

export default async () => {
  const data = await fetchData()
  return parseRecords(data)
}
