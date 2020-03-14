import _ from 'lodash'
import { createfetchFactoryByKey } from './data'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import regeneratorRuntime from 'regenerator-runtime'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'

const fetchRocData = createfetchFactoryByKey('tw-csv')
const fetchData = createfetchFactoryByKey('main')

const StyledTable = styled.div`
.MuiBox-root{
  padding: 0em;
}
`

export const mapCountryCodeAsEmoji = (countryCode = '') => {
  if (countryCode.length !== 2) {
    return '🌎'
  }
  return countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

console.log('hello world')

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
      {value === index && <Box p={3}>{children}</Box>}
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

export const SimpleTable = ({ rows }) => {
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        {/* <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align='right'>description</TableCell>
          </TableRow>
        </TableHead>
        */}
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const DataContainer = () => {
  const [viewByCountryCode, setViewByCountryCode] = React.useState({})

  useEffect(() => {
    if (_.isEmpty(viewByCountryCode)) {
      fetchData()
        .then(
          (data) => {
            console.log('data', data)
          }
        )

      setViewByCountryCode(
        {
          TW: [
            {
              titleKey: 'test.TW'
            },
            {
              titleKey: `國民：第三級警告（非必要勿前往）
轉機得入境者，需居家檢疫14天：部分機場暫停航班
14日內曾經入境或居住於香的外籍人士：暫緩入境`
            }
          ],
          HK: [
            {
              titleKey: 'test.HK'
            }
          ]
        }
      )
    }
  })

  return <ScrollableTabs viewByCountryCode={viewByCountryCode}>test</ScrollableTabs>
}

export const ScrollableTabs = ({ viewByCountryCode }) => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const countryRecords = _.toPairs(_.mapValues(viewByCountryCode, (data, countryCode) =>
    data.map(d => ({
      // TODO proper  i18n with react-intl
      name: mapCountryCodeAsEmoji(countryCode) + countryCode,
      description: data['titleZh-TW'] || 'testing description'
    })
    ))
  )

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
        >
          {
            _.map(countryRecords, ([countryCode, data], i) => (
              <Tab label={mapCountryCodeAsEmoji(countryCode) + countryCode} {...a11yProps(0)} />
            ))
          }
        </Tabs>
      </AppBar>
      {
        _.map(countryRecords, ([countryCode, data], i) => (
          <TabPanel key={countryCode + '-content'} value={value} index={i}>
            {JSON.stringify(data)}
            <StyledTable>
              <SimpleTable rows={data} />
            </StyledTable>
          </TabPanel>
        ))
      }
    </div>
  )
}

const App = document.getElementById('app')

ReactDOM.render(<DataContainer>test</DataContainer>, App)
