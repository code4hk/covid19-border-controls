// hack jest as a runner
/* global describe,test */
import fetch from 'isomorphic-fetch'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { defaultLocales } from '../i18n'
describe('build locale json', () => {
  test('build', async () => {
    defaultLocales.forEach(
      async locale => {
        let dataLocale = locale
        const override = {}
        if (locale === 'zh-TW') {
          dataLocale = 'zh_Hant_TW'
          // this is better
          override['country.hk'] = '香港'
          override['country.mo'] = '澳門'
        }
        const countries = await fetch('https://raw.githubusercontent.com/umpirsky/country-list/master/data/' + dataLocale + '/country.json')
        // const languagesNative = await fetch('https://raw.githubusercontent.com/umpirsky/language-list/master/data/' + dataLocale + '/language.json')

          .then(res => res.json())
        const data = {
          ..._.mapKeys(countries, (v, k) => 'country.' + _.toLower(k)),
          ...override,
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
