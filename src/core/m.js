export function m(type, attr) {
  let props = {}
  let nodeName = type
  // debugger
  const childrenLength = arguments.length - 2
  let childrenArr = Array(childrenLength)
  // 重新計算一個 child (有可能有 array 陣列)
  let childrenMultipleArr = []
  if (childrenLength) {
    for (let i = 0; i < childrenLength; i++) {
      const args = Array.prototype.slice.call(arguments[i + 2])
      if (typeof args[i] !== 'string' && args.length && typeof args === 'object') {
        args.forEach((arg) => {
          childrenMultipleArr.push(arg)
        })
      } else {
        childrenMultipleArr.push(arguments[i + 2])
      }
    }
  }

  // add children into props
  props.children = childrenMultipleArr
  // handleArray
  props.children.forEach((children, index) => {
    if (Array.isArray(children)) {
      children.forEach((child, i) => {
        props.children[index+i] = child
      })
    }
  })
  // add attr into props
  if (typeof attr === 'object' && attr !== null) {
    let keys = Object.keys(attr)
    for (let i = 0, len = Object.keys(attr).length; i < len; i++) {
      props[keys[i]] = attr[keys[i]]
    }
  }

  // return VElement
  return {
    nodeName,
    props
  }

}
