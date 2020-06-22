import { ElvinInstanceMap } from "./ElvinInstanceMap"
import { ElvinReconciler } from "./ElvinReconciler"

export function ElvinComponent() {}

ElvinComponent.prototype.setState = function (partialState) {
  const internalInstance = ElvinInstanceMap.get(this)
  internalInstance._pendingPartialState =
    internalInstance._pendingPartialState || []
  internalInstance._pendingPartialState.push(partialState)

  if (!internalInstance._updating) {
    ElvinReconciler.performUpdateIfNecessary(internalInstance)
  }
}
