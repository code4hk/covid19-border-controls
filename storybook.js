import { configure } from '@storybook/react'
import * as Welcome from './stories/0-Welcome.stories'
import * as Data from './stories/1-Data.stories'
import * as Tabs from './stories/2-Table.stories'

configure(() => [Welcome, Data, Tabs], module)
