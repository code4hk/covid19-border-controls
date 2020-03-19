import _ from 'lodash'
import React from 'react'
import regeneratorRuntime from 'regenerator-runtime'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
// import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { FormattedMessage, useIntl } from 'react-intl'
import { getCountryLabel } from '../i18n'
const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

export const getColor = ({ type }) => {
  // TW CDC Codes
  // 1: '#388209',
  // 2: '#d8a004',
  // 3: '#860b0b'

  return {
    advisory: '#faff009e',
    quarantine: '#ffa50096',
    restricted: '#ff4c4c78'
  }[type] || 'white'
}

export default ({ rows, isObject }) => {
  const classes = useStyles()
  if (_.isEmpty(rows)) {
    return <></>
  }

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
          {_.orderBy(
            rows,
            ([countryCode, countryData]) => countryData.severity || 0,
            'desc'
          ).map((row) => {
            if (_.isEmpty(row)) {
              return <></>
            }
            const [countryCode, countryData] = row

            const backgroundColor = getColor(countryData)
            return (
              <TableRow style={{ backgroundColor }} key={countryData.name}>
                <TableCell component='th' scope='row'>
                  {getCountryLabel(countryCode)}
                </TableCell>
                <TableCell style={{ 'white-space': 'pre-wrap' }} align='right'><FormattedMessage id={countryData.titleI18nKey} /></TableCell>
                <TableCell style={{ 'white-space': 'pre-wrap' }} align='right'><a href={countryData.sourceUrl}>{countryData.source} </a></TableCell>
              </TableRow>
            )
          }

          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
