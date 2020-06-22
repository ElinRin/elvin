import { ElvinCompositeComponentWrapper } from "./ElvinCompositeComponentWrapper"
import { ElvinReconciler } from "./ElvinReconciler"
import { ElvinComponent } from "./ElvinComponent"

const TopLevelWrapper = function (props) {
  this.props = props
}

TopLevelWrapper.prototype.render = function () {
  return this.props
}

function mixSpecIntoComponent(Constructor, spec) {
  const proto = Constructor.prototype

  for (const key in spec) {
    proto[key] = spec[key]
  }
}

export const Elvin = {
  createElement(type, props, ...children) {
    console.log({ children, props })
    const element = {
      type,
      props: props || {},
    }

    if (children) {
      element.props.children = children
    }

    return element
  },

  createClass(spec) {
    function Constructor(props) {
      this.props = props

      const initialState = this.getInitialState ? this.getInitialState() : null
      this.state = initialState
    }

    Constructor.prototype = new ElvinComponent()

    mixSpecIntoComponent(Constructor, spec)

    return Constructor
  },

  render(element, container) {
    const prevComponent = getTopLevelComponentInContainer(container)

    if (prevComponent) {
      return updateRootComponent(prevComponent, element)
    } else {
      return renderNewRootComponent(element, container)
    }
  },
}

function getTopLevelComponentInContainer(container) {
  return container.__elvinComponentInstance
}

function renderNewRootComponent(element, container) {
  const wrapperElement = Elvin.createElement(TopLevelWrapper, element)
  const componentInstance = new ElvinCompositeComponentWrapper(wrapperElement)

  const markUp = ElvinReconciler.mountComponent(componentInstance, container)
  container.__elvinComponentInstance = componentInstance._renderedComponent

  return markUp
}

function updateRootComponent(prevComponent, nextElement) {
  ElvinReconciler.receiveComponent(prevComponent, nextElement)
}
