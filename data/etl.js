import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import { format, parse, parseISO } from 'date-fns'
import Papa from 'papaparse'
const GSHEET_DATA_PATH = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBHcZsrJ-2qja3Sel4LIWxZG_dxGeqsIcQANOT8fEaRxMPuDgKrKwMdNMEncTie7oSU9lG7-nkNggE/pub?gid=0&single=true&output=csv'
const TW_ROC_DATA_PATH = 'https://yacdn.org/serve/https://www.cdc.gov.tw/CountryEpidLevel/ExportJSON'

const removeBOM = s => (s || '').replace(/[\t\n\r\f\uFEFF]/gm, '')

// don't rely on record.ISO3166_2 https://github.com/code4hk/covid19-border-controls/issues/1
// effective is always the current Date, not truly startDate. good enough for current viz though
// TODO handle expires
export const parseTWRoc = async (records) => {
  // already sorted desc

  const canoincalRecords = records.map(
    r => {
      return {
        homeCountryCode: 'TW',
        targetCountryCode: r.ISO3166,
        type: 'advisory',
        startDate: parseISO(r.effective),
        'titleZh-TW': r.severity_level,
        ...r
      }
    }
  )

  return parseViewModelByCountryCodeAndMessages(
    canoincalRecords, 'tw-roc'
  )
}

export const parseRecord = (r) => {
  // TODO simplify this
  let startDate = r.startDate
  if (!_.isDate(startDate)) {
    startDate = parse(r.startDate, 'yyyy/MM/dd', new Date())
    if (_.isNaN(startDate.getTime())) {
      startDate = parse('2020/03/01', 'yyyy/MM/dd', new Date())
    }
  }
  return _.merge(
    r,
    {
      startDate
    }
  )
}
export const parseRecordWithMessagesByLocale = (record, source) => {
  // unique id of i18n key: assume date is set correctly from the beginning
  const locales = ['zh-TW', 'en', 'jp', 'kr']
  const i18nKey = getI18nKeyWithRecord(record, source)

  const messagesByLocale = _.fromPairs(locales.map(
    locale => {
      const description = _.trim(record['description' + _.upperFirst(locale)] || record.descriptionEn || '')
      // some records only got description
      const title = _.trim(record['title' + _.upperFirst(locale)] || record.titleEn || description || '')
      return [locale, {
        [i18nKey + '.title']: title,
        [i18nKey + '.description']: description
      }]
    }
  ))
  return {
    record: { ...record, i18nKey },
    messagesByLocale
  }
}

export const getI18nKeyWithRecord = (record, source) => {
  const { homeCountryCode, targetCountryCode, startDate } = record
  return _.toLower([source, homeCountryCode, targetCountryCode, format(startDate, 'yyyyMMdd')].join('.'))
}
export const parseViewModelByCountryCodeAndMessages = (records, source) => {
  const allMessagseByLocale = {}
  const viewModelByCountryCode = _.mapValues(
    _.groupBy(
      records,
      r => r.homeCountryCode
    ),
    records => {
      const byTarget = _.groupBy(
        records, r => r.targetCountryCode
      )
      // note the side effect
      // pick latest record (if overlapping)
      return _.mapValues(
        byTarget,
        records => {
          const recordsSantized = _.map(
            records,
            parseRecord
          )

          const { record, messagesByLocale } = parseRecordWithMessagesByLocale(
            _.first(_.orderBy(recordsSantized, r => r.startDate, 'desc')),
            source
          )

          _.merge(allMessagseByLocale, messagesByLocale)
          return record
        }
      )
    }
  )

  return {
    viewModelByCountryCode,
    messagesByLocale: allMessagseByLocale
  }
}
export const createLoadFactoryByKey = (key) => {
  // use a canonical format
  return {
    'tw-roc': async () => {
      // res is stream based, need to parse as text
      const jsonString = await fetch(TW_ROC_DATA_PATH, {
        headers: {
        }
      })
        .then(res => res.text())
      const data = JSON.parse(removeBOM(jsonString) || '{}')
      return parseTWRoc(data)
    },
    // Schema refers to googleSheet & data.fixture.js
    gsheet: async () => {
      const data = await fetch(GSHEET_DATA_PATH)
        .then(res => res.text())

      const parsedRecords = Papa.parse(data, {
        header: true
      })
      // remove the first rows
      return parseViewModelByCountryCodeAndMessages(parsedRecords.data.splice(2), 'gsheet')
      // TODO pre-built the data to filesystems and import
    }
  }[key] || _.identity
}
