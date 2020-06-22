import { Elvin } from "../lib/Elvin"

const MyComponent = Elvin.createClass({
  componentWillMount() {
    this.renderCount = 0
  },

  getInitialState() {
    return {
      message: "state from getInitialState",
    }
  },

  componentWillReceiveProps() {
    this.setState({ message: "state from componentWillReceiveProps" })
  },

  render() {
    this.renderCount += 1

    return (
      <h1>
        This is render {this.renderCount} with state {this.state.message} and
        this prop: {this.props.prop}
      </h1>
    )
  },
})

Elvin.render(<MyComponent prop="first prop" />, document.getElementById("root"))

setTimeout(function () {
  Elvin.render(
    <MyComponent prop="second prop" />,
    document.getElementById("root"),
  )
}, 2000)
