
import React from 'react'
import renderer from 'react-test-renderer'

import User from './User.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<User />).toJSON()
    expect(tree).toMatchSnapshot()
})

