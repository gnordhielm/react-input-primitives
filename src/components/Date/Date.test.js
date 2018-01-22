
import React from 'react'
import renderer from 'react-test-renderer'

import Date from './Date.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<Date />).toJSON()
    expect(tree).toMatchSnapshot()
})

