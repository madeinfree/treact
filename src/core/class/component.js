import { updateRenderState } from '../render'

export class Component {
  constructor(props) {
    this._dirtyComponent = true
    this.props = props
    if (!this.state) this.state = {}
  }

  setState(state) {
    this.state = Object.assign({}, this.state, state)
    setTimeout(() => updateRenderState(this), 0)
  }

  render() {}
}
