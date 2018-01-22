
import React from 'react'
import renderer from 'react-test-renderer'

import String from './String.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<String />).toJSON()
    expect(tree).toMatchSnapshot()
})

