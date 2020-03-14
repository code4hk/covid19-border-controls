# covid19-border-controls

## Demo
Hosted [Github Pages](https://code4hk.github.io/covid19-border-controls/)

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
