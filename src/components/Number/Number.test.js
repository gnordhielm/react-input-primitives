
import React from 'react'
import renderer from 'react-test-renderer'

import Number from './Number.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<Number />).toJSON()
    expect(tree).toMatchSnapshot()
})

