import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import regeneratorRuntime from 'regenerator-runtime'
import { getCountryLabel } from '../i18n'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CountryTable from './react-country-table'
import { FormattedMessage } from 'react-intl'

export const asObjectRecords = (countryRecords) => {
  const allCountryCodes = _.map(countryRecords, ([countryCode, records]) => countryCode)
  return _.map(allCountryCodes, countryCode => [countryCode,
    // not in 1 pass due to GLOBAL
    _.filter(
      _.flatMap(countryRecords, ([homeCountryCode, records]) =>
        _.map(records, ([targetCountryCode, countryData]) => {
          if (homeCountryCode === countryCode) {
            return
          }
          if (_.includes([countryCode, 'GLOBAL'], targetCountryCode)) {
            return [homeCountryCode, countryData]
          }
        })
      )
      , Boolean)
  ])
}

export default ({ countryRecords }) => {
  const classes = useStyles()

  const [tabIndex, setTabIndex] = React.useState(0)

  const [subTabIndex, setSubTabIndex] = React.useState(0)

  const [currentCountryCode] = countryRecords[tabIndex] || []

  let displayedCountryRecords = countryRecords
  if (subTabIndex === 1) {
    displayedCountryRecords = asObjectRecords(countryRecords)
    console.log('displayedCountryRecords', displayedCountryRecords)
  }

  if (_.isEmpty(displayedCountryRecords)) {
    return <></>
  }
  return (
    <div className={classes.root}>
      <AppBar position='sticky' color='white' elevation={1}>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => {
            setTabIndex(newValue)
          }}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
        >
          {
            _.map(countryRecords, ([countryCode, data], i) => (
              <Tab
                label={getCountryLabel(countryCode)} {...a11yProps(0)}
              />
            ))
          }
        </Tabs>
      </AppBar>
      <Tabs
        value={subTabIndex}
        onChange={(event, newValue) => {
          setSubTabIndex(newValue)
        }}
        indicatorColor='primary'
        textColor='primary'
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
      >
        <Tab
          label={<FormattedMessage id='borders.control.subject' values={{ country: getCountryLabel(currentCountryCode) }} />} {...a11yProps(0)}
        />
        <Tab
          label={<FormattedMessage id='borders.control.object' values={{ country: getCountryLabel(currentCountryCode) }} />} {...a11yProps(0)}
        />
      </Tabs>
      {
        _.map(displayedCountryRecords, ([countryCode, countryRecords], i) => (
          <TabPanel key={countryCode + '-content'} value={tabIndex} index={i}>
            <CountryTable rows={countryRecords} />
          </TabPanel>
        ))
      }
    </div>
  )
}

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  )
}

function a11yProps (index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))
