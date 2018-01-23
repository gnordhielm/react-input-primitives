
import React, { PureComponent } from 'react'

class Number extends PureComponent {

	state = {
        componentName: "Number"
    }

    render() {
        return (
            <div className="av number">
                <p>{this.state.componentName}</p>
            </div>
        )
    }
}

Number.defaultProps = {}

export default Number
