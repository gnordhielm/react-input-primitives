
import React from 'react'
import renderer from 'react-test-renderer'

import Color from './Color.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<Color />).toJSON()
    expect(tree).toMatchSnapshot()
})

