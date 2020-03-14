import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import Papa from 'papaparse'
const GSHEET_DATA_PATH = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBHcZsrJ-2qja3Sel4LIWxZG_dxGeqsIcQANOT8fEaRxMPuDgKrKwMdNMEncTie7oSU9lG7-nkNggE/pub?gid=0&single=true&output=csv'
const parseTWRocCsv = (data) => {
  const parsedRecords = Papa.parse(data, {
    header: true
  })
  console.log('parsedRecords', parsedRecords)
  return {
  }
}

const parseRecordAsMessagesByLocale = (record) => {
  const { homeCountryCode, targetCountryCode, startDate } = record
  const key = [homeCountryCode, targetCountryCode, startDate].join('.')
  const locales = ['zh-TW', 'en', 'jp', 'kr']

  const messagesByLocale = _.fromPairs(locales.map(
    locale => [locale, {
      [key + '.title']: 'title' + _.camelCase(key),
      [key + '.description']: 'description' + _.camelCase(key)
    }]
  ))
  return {
    ...record,
    messagesByLocale
  }
}

export const parseViewByCountryCode = (records) => {
  return _.mapValues(
    _.groupBy(
      records,
      r => r.homeCountryCode
    ),
    records => {
      const byTarget = _.groupBy(
        records, r => r.targetCountryCode
      )

      // TODO parse data before desc
      // pick latest record (if overlapping)
      return _.mapValues(
        byTarget,
        records => parseRecordAsMessagesByLocale(_.first(_.orderBy(records, r => r.startDate, 'desc')))
      )
    }
  )
}
// Schema refers to googleSheet & data.fixture.js

export const createfetchFactoryByKey = (key) => {
  return {
    'tw-csv': () => {

    },
    main: async () => {
      const data = await fetch(GSHEET_DATA_PATH)
        .then(res => res.text())

      const parsedRecords = Papa.parse(data, {
        header: true
      })
      // remove the first rows
      return parseViewByCountryCode(parsedRecords.data.splice(2))
      // TODO pre-built the data to filesystems and import
    }
  }[key] || _.identity
}
