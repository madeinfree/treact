let releaseQueue = []

export function render(vnode, container, base) {
  let dom = createVDOM(base, vnode)
  if (container && container !== dom.parentNode) {
    container.appendChild(dom)
  }
}


function createVDOM(base, vnode, realDOM) {

  if (typeof vnode.nodeName === 'function') {
    if (base && base._vnode && !base._vnode._dirtyComponent) {
      return base
    } else {
      let VDOMComponent = createVDOMComponent(base, vnode)
      return VDOMComponent
    }
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    let realDOM
    if (base && base instanceof Text) {
      realDOM = base
      if(realDOM.nodeValue !== vnode) {
        realDOM.nodeValue = vnode
      }
    } else {
      realDOM = document.createTextNode(vnode)
    }
    return realDOM
  }

  // 處理像 table 類的巢狀元素
  if(base && base.childNodes) {
    nestRenderComponent(base, vnode)
    return
  }

  if (vnode.props && vnode.props.children) {
    let realDOM = document.createElement(vnode.nodeName)
    let children = vnode.props.children
    for (let i = 0; i < children.length; i++) {
      let dom = createVDOM(undefined, children[i], realDOM)
      realDOM.appendChild(dom)
      bindHandler(realDOM, vnode.props)
      bindStyle(realDOM, vnode.props)
      bindClass(realDOM, vnode.props)
    }
    return realDOM
  }
}

function createVDOMComponent(base, vnode) {
  let nodeName = vnode.nodeName
  let props = vnode.props
  let children = props.children

  let ins = new nodeName(props)
  let childrenComponent

  if (ins.render) {
    let renderInsDOM = ins.render()
    childrenComponent = createVDOM(base, renderInsDOM, ins)
    childrenComponent._vnode = ins
    // VDOM 建構完成後 _dirtyComponent 改為 false
    ins._dirtyComponent = false
  }
  ins._base = childrenComponent

  return childrenComponent
}

function nestRenderComponent(base, vnode) {
  let baseChildNodes = base.childNodes
  let vnodePropsChild = vnode.props.children
  let firstBaseChildNode = baseChildNodes[0]
  let vnodePropsChildValue = vnodePropsChild[0]
  ////------
  // 處理元素內部如果是 text
  if (vnodePropsChild.length === 1) {
    if (firstBaseChildNode instanceof Text && firstBaseChildNode.nodeValue !== vnodePropsChildValue) {
      firstBaseChildNode.nodeValue = vnodePropsChildValue
      firstBaseChildNode = null
      vnodePropsChildValue = null
      return
    }
  }
  ////------
  firstBaseChildNode = null
  vnodePropsChildValue = null
  baseChildNodes.forEach((node, index) => {
    createVDOM(node, vnodePropsChild[index])
  })
}

export function updateRenderState(ins) {
  let props = ins.props
  let state = ins.state
  let base = ins._base

  if (ins.render) {
    ins._dirtyComponent = true
    let rerender = ins.render()
    let oldVDOMPropsChildren = rerender.props.children
    let oldChildNodes = base.childNodes
    oldChildNodes.forEach((node, index) => {
      createVDOM(node, oldVDOMPropsChildren[index])
    })
    ins._dirtyComponent = false
  }

}

function bindHandler(realDOM, props) {
  Object.keys(props).forEach((prop) => {
    if (prop !== 'children') {
      if (prop === 'onClick') {
        realDOM.addEventListener('click', props[prop])
      }
    }
  })
}

function bindStyle(realDOM, props) {
  Object.keys(props).forEach((prop) => {
    if (prop === 'style') {
      Object.assign(realDOM.style, props[prop])
    }
  })
}

function bindClass(realDOM, props) {
  Object.keys(props).forEach((prop) => {
    if (prop === 'class') {
      realDOM.setAttribute(prop, props[prop])
    }
  })
}

function flushReleaseQueue() {
  releaseQueue.forEach((queue) => queue = null)
}
