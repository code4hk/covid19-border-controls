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
  return {
    advisory: 'yellow',
    quarantine: 'orange',
    restricted: '#ff4c4c'
  }[type] || 'white'
}

// for sorting
export const getSeverityOrder = (countryData) => {
  // TODO clarify relationship at TW ROC
  // "severity_level":"第一級:注意(Watch)"
  if (countryData.type === 'advisory') {
    if (countryData.severity_level === '第二級:注意(Watch)') {
      return 2
    }
    if (countryData.severity_level === '第三級:警告(Warning)') {
      return 3
    }
  }

  return {
    advisory: 1,
    quarantine: 20,
    restricted: 30
  }[countryData.type] || 0
}

export default ({ rows }) => {
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
            r => getSeverityOrder(_.get(r, '1')) || 0,
            'desc'
          ).map((row) => {
            if (_.isEmpty(row)) {
              return <></>
            }
            const [countryCode, countryData] = row

            const backgroundColor = getColor(countryData)
            return (
              <TableRow key={countryData.name}>
                <TableCell style={{ backgroundColor }} component='th' scope='row'>
                  {getCountryLabel(countryCode)}
                </TableCell>
                <TableCell style={{ 'white-space': 'pre-wrap' }} align='right'><FormattedMessage id={countryData.titleI18nKey} /></TableCell>
              </TableRow>
            )
          }

          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
