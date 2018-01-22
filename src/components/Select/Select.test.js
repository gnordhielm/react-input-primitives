
import React from 'react'
import renderer from 'react-test-renderer'

import Select from './Select.jsx'
import { taskIndent } from 'constants'

test("component renders", () => {
    const tree = renderer.create(<Select />).toJSON()
    expect(tree).toMatchSnapshot()
})

