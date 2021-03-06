import React, { Component } from 'react'
import { KeyUtils } from 'slate'

import { hexGen } from '@slate-collaborative/bridge'

import Connection from './Connection'
import { ControllerProps } from './model'

class Controller extends Component<ControllerProps> {
  connection?: Connection

  state = {
    preloading: true
  }

  componentDidMount() {
    const {
      editor,
      url,
      cursorAnnotationType,
      annotationDataMixin,
      connectOpts
    } = this.props

    KeyUtils.setGenerator(() => hexGen())

    editor.connection = new Connection({
      editor,
      url,
      connectOpts,
      cursorAnnotationType,
      annotationDataMixin,
      onConnect: this.onConnect,
      onDisconnect: this.onDisconnect
    })
  }

  componentWillUnmount() {
    const { editor } = this.props

    if (editor.connection) editor.connection.close()

    delete editor.connection
  }

  render() {
    const { children, renderPreloader } = this.props
    const { preloading } = this.state

    if (renderPreloader && preloading) return renderPreloader()

    return children
  }

  onConnect = () => {
    const { onConnect, editor } = this.props

    this.setState({
      preloading: false
    })

    onConnect && onConnect(editor.connection)
  }

  onDisconnect = () => {
    const { onDisconnect, editor } = this.props

    this.setState({
      preloading: true
    })

    onDisconnect && onDisconnect(editor.connection)
  }
}

export default Controller
