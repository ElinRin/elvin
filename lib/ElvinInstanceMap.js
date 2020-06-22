export const ElvinInstanceMap = {
  set(key, value) {
    key.__elvinInternalInstance = value
  },

  get(key) {
    return key.__elvinInternalInstance
  },
}
