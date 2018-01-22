
import React from 'react'
import renderer from 'react-test-renderer'

import File from './File.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<File />).toJSON()
    expect(tree).toMatchSnapshot()
})

