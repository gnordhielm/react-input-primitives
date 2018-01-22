
import React from 'react'
import renderer from 'react-test-renderer'

import Boolean from './Boolean.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<Boolean />).toJSON()
    expect(tree).toMatchSnapshot()
})

