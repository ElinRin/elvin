export class ElvinDOMComponent {
  constructor(element) {
    this._currentElement = element
  }

  mountComponent(container) {
    const domElement = document.createElement(this._currentElement.type)
    const textNode = document.createTextNode(
      this._currentElement.props.children.join(""),
    )

    domElement.appendChild(textNode)
    container.appendChild(domElement)

    this._hostNode = domElement
    return domElement
  }

  receiveComponent(nextElement) {
    const prevElement = this._currentElement
    this.updateComponent(prevElement, nextElement)
  }

  updateComponent(prevElement, nextElement) {
    const lastProps = prevElement.props
    const nextProps = nextElement.props

    this._updateDOMProperties(lastProps, nextProps)
    this._updateDOMChildren(lastProps, nextProps)
  }

  _updateDOMProperties() {
    // nothing to do! I'll explain why below
  }

  _updateDOMChildren(lastProps, nextProps) {
    const lastContent = lastProps.children.join("")
    const nextContent = nextProps.children.join("")

    if (!nextContent) {
      this.updateTextContent("")
    } else if (lastContent !== nextContent) {
      this.updateTextContent("" + nextContent)
    }
  }

  updateTextContent(content) {
    const node = this._hostNode
    node.textContent = content

    const firstChild = node.firstChild

    if (
      firstChild &&
      firstChild === node.lastChild &&
      firstChild.nodeType === 3
    ) {
      firstChild.nodeValue = content
      return
    }

    node.textContent = content
  }
}
