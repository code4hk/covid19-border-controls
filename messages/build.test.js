// hack jest as a runner
/* global describe,test */
import fetch from 'isomorphic-fetch'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { defaultLocales } from '../i18n'
describe('build locale json', () => {
  test('build', async () => {
    const overrideByLocale = {
      'zh-TW': {
        'country.hk': '香港',
        'country.mo': '澳門',
        'country.global': '全球'
      },
      en: {
        'country.global': 'Global'
      },
      ja: {
        'country.global': '世界的'
      },
      ko: {
        'country.global': '글로벌'
      }
    }
    defaultLocales.forEach(
      async locale => {
        let dataLocale = locale

        if (locale === 'zh-TW') {
          dataLocale = 'zh_Hant_TW'
          // this is better
          // override['country.hk'] = '香港'
          // override['country.mo'] = '澳門'
          // override['country.global'] = '全球'
        }
        const countries = await fetch('https://raw.githubusercontent.com/umpirsky/country-list/master/data/' + dataLocale + '/country.json')
        // const languagesNative = await fetch('https://raw.githubusercontent.com/umpirsky/language-list/master/data/' + dataLocale + '/language.json')

          .then(res => res.json())
        const data = {
          ..._.mapKeys(countries, (v, k) => 'country.' + _.toLower(k)),
          ...overrideByLocale[locale],
          'language.native.zh-TW': '中文',
          'language.native.en': 'English',
          'language.native.ja': '日本語',
          'language.native.ko': '한국어'
        }
        return fs.writeFileSync(path.resolve(__dirname, './' + locale + '.json'), JSON.stringify(data, null, 4))
      }
    )
  })
})
