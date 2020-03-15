import React from 'react'
import { action } from '@storybook/addon-actions'
import DataContainer from '../ui/react-data-container'
export default {
  title: 'Data'
}

const PrettyPrint = ({ countryRecords }) => (
  <div style={{ 'white-space': 'pre-wrap' }}>{JSON.stringify(countryRecords, null, 4)}</div>
)

export const SourceContribution = () => (
  <div>
    <ul>

      <li>
        <a href='https://docs.google.com/spreadsheets/d/1aGbnb8bzp99gCWvjh_23JHo4BsF5nyRquCUme7YqDqU/edit#gid=0'>Data sourced from Google SpreadSheet 武漢肺炎各國出入口管制 COVID-19 Borders Control</a>
      </li>
      <li>
        Also Open data at <a href='https://data.gov.tw/dataset/10567'>https://data.gov.tw/dataset/10567</a>
      </li>
    </ul>

  </div>
)

export const DataLoader = () => (
  <DataContainer>
    <PrettyPrint />
  </DataContainer>
)
// TODO show raw data
