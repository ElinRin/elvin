import { ElvinInstanceMap } from "./ElvinInstanceMap"
import { ElvinReconciler } from "./ElvinReconciler"
import { ElvinDOMComponent } from "./ElvinDOMComponent"

function instantiateElvinComponent(element) {
  if (typeof element.type === "string") {
    return new ElvinDOMComponent(element)
  } else if (typeof element.type === "function") {
    return new ElvinCompositeComponentWrapper(element)
  }
}

export class ElvinCompositeComponentWrapper {
  constructor(element) {
    this._currentElement = element
  }

  mountComponent(container) {
    const Component = this._currentElement.type
    const componentInstance = new Component(this._currentElement.props)
    this._instance = componentInstance

    ElvinInstanceMap.set(componentInstance, this)

    if (componentInstance.componentWillMount) {
      componentInstance.componentWillMount()
    }

    const markup = this.performInitialMount(container)

    if (componentInstance.componentDidMount) {
      componentInstance.componentDidMount()
    }

    return markup
  }

  performInitialMount(container) {
    const renderedElement = this._instance.render()

    const child = instantiateElvinComponent(renderedElement)
    this._renderedComponent = child

    return ElvinReconciler.mountComponent(child, container)
  }

  performUpdateIfNecessary() {
    this.updateComponent(this._currentElement, this._currentElement)
  }

  receiveComponent(nextElement) {
    const prevElement = this._currentElement
    this.updateComponent(prevElement, nextElement)
  }

  updateComponent(prevElement, nextElement) {
    this._updating = true
    const nextProps = nextElement.props
    const inst = this._instance

    const willReceive = prevElement !== nextElement

    if (willReceive && inst.componentWillReceiveProps) {
      inst.componentWillReceiveProps(nextProps)
    }

    let shouldUpdate = true

    const nextState = this._processPendingState()

    if (inst.shouldComponentUpdate) {
      shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState)
    }

    if (shouldUpdate) {
      this._performComponentUpdate(nextElement, nextProps, nextState)
    } else {
      inst.props = nextProps
    }

    this._updating = false
  }

  _processPendingState() {
    const inst = this._instance
    if (!this._pendingPartialState) {
      return inst.state
    }

    let nextState = inst.state

    for (let i = 0; i < this._pendingPartialState.length; ++i) {
      nextState = Object.assign({}, nextState, this._pendingPartialState[i])
    }

    this._pendingPartialState = null
    return nextState
  }

  _performComponentUpdate(nextElement, nextProps, nextState) {
    this._currentElement = nextElement
    const inst = this._instance

    inst.props = nextProps
    inst.state = nextState

    this._updateRenderedComponent()
  }

  _updateRenderedComponent() {
    const prevComponentInstance = this._renderedComponent
    const inst = this._instance
    const nextRenderedElement = inst.render()

    ElvinReconciler.receiveComponent(prevComponentInstance, nextRenderedElement)
  }
}
