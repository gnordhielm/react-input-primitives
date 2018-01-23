
import React, { PureComponent } from 'react'

class File extends PureComponent {

	state = {
        componentName: "File"
    }

    render() {
        return (
            <div className="av file">
                <p>{this.state.componentName}</p>
            </div>
        )
    }
}

File.defaultProps = {}

export default File
