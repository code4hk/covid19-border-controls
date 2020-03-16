# covid19-border-controls

## Demo
Hosted at [Github Pages](https://code4hk.github.io/covid19-border-controls/)

## License
MIT

## This project started at g0v.tw
- [關於設計共筆(中文)](https://hackmd.io/Ul1eq1hoSL28akTlj2aLZA)


## Country, Language Names
- Generated from https://github.com/umpirsky/country-list/tree/master/data
- To add locales, Modify messages/build.test.js & Run build:locales
- (zh_Hant_TW into zh-TW)
- We use this instead of [countries-list](https://www.npmjs.com/package/countries-list) which don't support Traditional Chinese

## For Babel & Jest Config
- https://github.com/facebook/jest/issues/3126#issuecomment-465926747

## For storybook setup
- Start the server `yarn storybook:server`
- Start a standalone storybook to load stories `yarn storybook`

- https://github.com/storybookjs/storybook/tree/next/examples/standalone-preview
