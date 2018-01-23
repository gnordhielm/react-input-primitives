import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import SimpleUsage from './simple_usage'
// import MultipleModals from './multiple_modals'
// import Forms from './forms'
// import ReactRouter from './react-router'
// import NestedModals from './nested_modals'

const appElement = document.getElementById('example')

const test = props => (
  <div>This is a test</div>
)

const examples = [
  // SimpleUsage,
  // Forms,
  // MultipleModals,
  // NestedModals,
  // ReactRouter
  {
    label: 'test',
    app: test
  }
]

const App = props => (
  <div>
    {examples.map((example, idx) => {
      const ExampleApp = example.app
        return (
          <div key={idx} className="example">
            <h3>{`#${idx + 1}. ${example.label}`}</h3>
            <ExampleApp />
          </div>
        )
    })}
  </div>
)


class App extends Component {

  state = {
    example: examples[0]
  }

  render() {

    const ExampleApp = this.state.example.app

    return (
      <div className="container">
        <nav>
          {examples.map(({ label }, idx) => (
            <a
              className={this.state.example.label === label ? 'active' : ''}
              key={idx}
              onClick={e => {
                e.preventDefault()
                this.setState(() => ({
                  example = examples[idx]
                }))
              }}
            >{label}</a>
          ))}
        </nav>
        <main>
          <ExampleApp />
        </main>

      </div>
    );
  }
}

ReactDOM.render(<App />, appElement)
