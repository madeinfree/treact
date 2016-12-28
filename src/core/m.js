export function m(type, attr) {
  let props = {}
  let nodeName = type
  const childrenLength = arguments.length - 2
  const childrenArr = Array(childrenLength)
  for (let i = 0; i < childrenLength; i++) {
    childrenArr[i] = arguments[i + 2]
  }

  // add children into props
  props.children = childrenArr
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
