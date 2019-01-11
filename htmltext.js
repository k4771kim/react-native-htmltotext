import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import { Parser } from 'parse5'
import styles from './styles'
import hljsStyles from './a11y-dark.styl'
import { INLINE_ELEMENTS, BLOCK_ELEMENTS } from './constants'

class HtmlText extends Component {
  constructor (props) {
    super(props)

    this.parser = new Parser()
    this.rootKey = 'rootKey'
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.html !== this.props.html ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.textStyle !== this.props.textStyle ||
      nextProps.allowFontScaling !== this.props.allowFontScaling
    )
  }

  stylesForNode (node) {
    if (this.isText(node)) {
      return this.props.textNodeStyle
    } else if (this.isInlineElement(node)) {
      if (node.attrs?.length > 0) {
        return hljsStyles[node.attrs[0].value]
      } else {
        return styles[node.nodeName]
      }
    } else if (this.isBlockElement(node)) {
      if (node.attrs?.length > 0) {
        return hljsStyles[node.attrs[0].value]
      } else {
        return styles[node.nodeName]
      }
    }
  }

  isText (node) {
    return node && node.nodeName === '#text'
  }

  isBlockElement (node) {
    return node && BLOCK_ELEMENTS.includes(node.nodeName)
  }

  isInlineElement (node) {
    return node && INLINE_ELEMENTS.includes(node.nodeName)
  }

  renderTextNode (node, parentKey) {
    const key = `${parentKey}_${node.nodeName}`
    const style = this.stylesForNode(node)
    const children = node.value

    return (
      <Text
        key={key}
        style={style}
        allowFontScaling={this.props.allowFontScaling}
      >
        {children}
      </Text>
    )
  }

  renderInlineNode (node, parentKey) {
    const key = `${parentKey}_${node.nodeName}`
    const style = this.stylesForNode(node)
    const children = node.childNodes
      .filter(node => !this.isBlockElement(node))
      .map((node, index) => this.renderNode(node, `${key}_${index}`))
    if (node.childNodes.length > children.length) {
      console.warn(
        'Nesting of block element inside inline element is not supported'
      )
    }

    return (
      <Text
        key={key}
        style={style}
        allowFontScaling={this.props.allowFontScaling}
      >
        {children}
      </Text>
    )
  }

  renderBlockNode (node, parentKey) {
    const key = `${parentKey}_${node.nodeName}`
    const style = this.stylesForNode(node)
    const children = []
    let inlineChildren = []

    node.childNodes.forEach((childNode, index) => {
      const child = this.renderNode(childNode, `${key}_${index}`)
      if (this.isBlockElement(childNode)) {
        if (inlineChildren.length > 0) {
          children.push(
            <Text key={`${key}_${index - 1}`} style={style}>
              <Text style={this.props.textNodeStyle}>{inlineChildren}</Text>
            </Text>
          )
          inlineChildren = []
        }

        children.push(child)
      } else if (this.isInlineElement(childNode) || this.isText(childNode)) {
        inlineChildren.push(child)
      }
    })

    if (inlineChildren.length > 0) {
      children.push(
        <Text key={`${key}_${node.childNodes.length - 1}`} style={style}>
          <Text style={this.props.textNodeStyle}>{inlineChildren}</Text>
        </Text>
      )
    }

    return children
  }

  renderNode (node, parentKey) {
    if (this.isText(node)) {
      return this.renderTextNode(node, parentKey)
    } else if (this.isInlineElement(node)) {
      return this.renderInlineNode(node, parentKey)
    } else if (this.isBlockElement(node)) {
      return this.renderBlockNode(node, parentKey)
    } else {
      console.warn(
        `Supported elements are ${INLINE_ELEMENTS} and ${BLOCK_ELEMENTS}`
      )
      return null
    }
  }

  render () {
    const html = `<div>${this.props.html}</div>`
    // this.props.html.startsWith('<div>')
    // ? this.props.html

    const children = this.parser
      .parseFragment(html)
      .childNodes.map((node, index) =>
        this.renderNode(node, `${this.rootKey}_${index}`)
      )

    return <Text style={this.props.containerStyle}>{children}</Text>
  }
}

HtmlText.propTypes = {
  allowFontScaling: PropTypes.bool.isRequired,
  html: PropTypes.string.isRequired,
  containerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ]),
  textNodeStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ]),
  inlineNodeStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ]),
  blockNodeStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ])
}
HtmlText.defaultProps = {
  allowFontScaling: false
}

export default HtmlText
