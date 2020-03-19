import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import twCdcLoader from './etl-tw-cdc'
import gsheetLoader from './etl-gsheet'
import { isValid, parse, format, isAfter } from 'date-fns'
import { defaultLocales } from '../i18n'
// for sorting
export const getSeverity = (countryData) => {
  return countryData.severity || {
    advisory: 1,
    quarantine: 20,
    restricted: 30
  }[countryData.type] || 0
}

export const parseRecord = (r) => {
  if (!isValid(r.startDate)) {
    r.startDate = parse('2020/03/01', 'yyyy/MM/dd', new Date())
  }
  if (!isValid(r.endDate)) {
    r.endDate = parse('2021/12/30', 'yyyy/MM/dd', new Date())
  }
  r.severity = r.severity || getSeverity(r)
  return r
}
export const parseRecordWithMessagesByLocale = (record, source) => {
  // unique id of i18n key: assume date is set correctly from the beginning
  const i18nKey = getI18nKeyWithRecord(record, source)

  const messagesByLocale = _.fromPairs(defaultLocales.map(
    locale => {
      // prefer English as fallback, while most are in Chinese (source) now.
      const description = _.trim(record['description' + _.upperFirst(locale)] || record.descriptionEn || record['descriptionZh-TW'] || '')
      // some records only got description
      const title = _.trim(record['title' + _.upperFirst(locale)] || record.titleEn || record['titleZh-TW'] || description || '')
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
          const recordsSantized = _.filter(
            _.map(
              records,
              parseRecord
            ), r => isAfter(r.endDate, new Date()))

          const lastRecord = _.first(_.orderBy(recordsSantized, r => r.startDate, 'desc'))
          if (!lastRecord) {
            return null
          }

          const { record, messagesByLocale } = parseRecordWithMessagesByLocale(
            lastRecord,
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

// each parser should return rows in canonical format
// use a canonical format, Schema refers to googleSheet & data.fixture.js
// TODO pre-built the data to filesystems and import

export const createLoadFactoryByKey = (key) => {
  const loaderByKey = {
    'tw-cdc': twCdcLoader,
    gsheet: gsheetLoader
  }

  const loader = loaderByKey[key] || (() => { throw new Error('missing loader for ' + key) })
  return async () => {
    const records = await loader()
    return parseViewModelByCountryCodeAndMessages(records, key)
  }
}
