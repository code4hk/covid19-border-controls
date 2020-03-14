import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import Papa from 'papaparse'
import { parse } from 'date-fns'
// https://docs.google.com/spreadsheets/d/1aGbnb8bzp99gCWvjh_23JHo4BsF5nyRquCUme7YqDqU/edit#gid=0
const GSHEET_DATA_PATH = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBHcZsrJ-2qja3Sel4LIWxZG_dxGeqsIcQANOT8fEaRxMPuDgKrKwMdNMEncTie7oSU9lG7-nkNggE/pub?gid=0&single=true&output=csv'
const fetchData = () => {
  return fetch(GSHEET_DATA_PATH)
    .then(res => res.text())
}

export default async () => {
  const csvData = await fetchData()
  const parsedRecords = Papa.parse(csvData, {
    header: true
  })
  console.log('parsedRecords', parsedRecords)
  // remove the first rows
  const records = parsedRecords.data.splice(2)
  // invalid date defers to handle by client
  return records.map(
    r => {
      return _.merge(
        r,
        {
          startDate: parse(r.startDate, 'yyyy/MM/dd', new Date())
        }
      )
    }
  )
}
