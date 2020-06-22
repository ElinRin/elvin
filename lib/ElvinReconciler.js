export const ElvinReconciler = {
  mountComponent(internalInstance, container) {
    return internalInstance.mountComponent(container)
  },

  receiveComponent(internalInstance, nextElement) {
    internalInstance.receiveComponent(nextElement)
  },

  performUpdateIfNecessary(internalInstance) {
    internalInstance.performUpdateIfNecessary()
  },
}
