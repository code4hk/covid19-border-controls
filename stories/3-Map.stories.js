import React from 'react'
import DataContainer from '../ui/react-data-container'
export default {
  title: 'Map (iframe)'
}

export const Description = () => (
  <div>
    <p>
      Map Visualization by @kiang at <a href='https://github.com/kiang/covid19-border-controls'>https://github.com/kiang/covid19-border-controls</a>
    </p>
    <p>
      hosted at <a href='https://kiang.github.io/covid19-border-controls/'>https://kiang.github.io/covid19-border-controls/</a>
    </p>
  </div>
)

export const Map = () => (
  <iframe height='800px' width='100%' src='https://kiang.github.io/covid19-border-controls/'>
    <span role='img' aria-label='so cool'>
      YO
    </span>
  </iframe>
)
