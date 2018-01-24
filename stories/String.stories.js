import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Input from 'react-input-primitives'


storiesOf('String', module)
  .add('with text', () =>
    <Input.String onChange={action('change')} value={'str'} />)
