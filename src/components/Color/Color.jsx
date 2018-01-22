
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

class Color extends PureComponent {

	state = {
        componentName: "Color"
    }

    render() {
        return (
            <div className="av color">
                <p>{this.state.componentName}</p>
            </div>
        )
    }
}

Color.defaultProps = {}

export default connect(
    state => ({  })
)(Color)

