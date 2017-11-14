import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Parser } from 'parse5';
import styles from './styles';
import { INLINE_ELEMENTS, BLOCK_ELEMENTS } from './constants';

class HtmlText extends Component {
    constructor(props) {
        super(props);

        this.parser = new Parser();
        this.rootKey = 'rootKey';
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.html !== this.props.html ||
            nextProps.blockNodeStyle !== this.props.blockNodeStyle ||
            nextProps.inlineNodeStyle !== this.props.inlineNodeStyle ||
            nextProps.containerStyle !== this.props.containerStyle;
    }

    stylesForNode(node) {
        if (this.isText(node)) {
            return this.props.inlineNodeStyle;
        } else if (this.isInlineElement(node)) {
            return [this.props.inlineNodeStyle, styles[node.nodeName] || {}];
        } else if (this.isBlockElement(node)) {
            return [this.props.blockNodeStyle, styles[node.nodeName] || {}];
        }
    }

    isText(node) {
        return node && node.nodeName === '#text';
    }

    isBlockElement(node) {
        return node && BLOCK_ELEMENTS.includes(node.nodeName);
    }

    isInlineElement(node) {
        return node && INLINE_ELEMENTS.includes(node.nodeName);
    }

    renderTextNode(node, parentKey) {
        const key = `${parentKey}_${node.nodeName}`;
        const style = this.stylesForNode(node);
        const children = node.value;

        return (
            <Text key={key} style={style}>{children}</Text>
        );
    }

    renderInlineNode(node, parentKey) {
        const key = `${parentKey}_${node.nodeName}`;
        const style = this.stylesForNode(node);
        const children = node.childNodes
            .filter((node) => this.isInlineElement(node) || this.isText(node))
            .map((node, index) => this.renderNode(node, `${key}_${index}`));

        return (
            <Text key={key} style={style}>{children}</Text>
        );
    }

    renderBlockNode(node, parentKey) {
        const key = `${parentKey}_${node.nodeName}`;
        const style = this.stylesForNode(node);
        const children = [];
        let inlineChildren = [];

        node.childNodes.forEach((childNode, index) => {
            const child = this.renderNode(childNode, `${key}_${index}`);
            if (this.isBlockElement(childNode)) {
                if (inlineChildren.length > 0) {
                    children.push(
                        <View key={`${key}_${index - 1}`} style={style}>{inlineChildren}</View>
                    );
                    inlineChildren = [];
                }

                children.push(child);
            } else if (this.isInlineElement(childNode) || this.isText(childNode)) {
                inlineChildren.push(child);
            }
        });

        if (inlineChildren.length > 0) {
            children.push(
                <View key={`${key}_${node.childNodes.length - 1}`} style={style}>{inlineChildren}</View>
            );
        }

        return children;
    }

    renderNode(node, parentKey, style) {
        if (this.isText(node)) {
            return this.renderTextNode(node, parentKey, style);
        } else if (this.isInlineElement(node)) {
            return this.renderInlineNode(node, parentKey, style);
        } else if (this.isBlockElement(node)) {
            return this.renderBlockNode(node, parentKey, style);
        } else {
            console.warn(`Supported elements are ${INLINE_ELEMENTS} and ${BLOCK_ELEMENTS}`);
            return null;
        }
    }

    render() {
        const html = this.props.html.startsWith('<div>') ? this.props.html : `<div>${this.props.html}</div>`;
        const children = this.parser.parseFragment(html)
            .childNodes
            .map((node, index) => this.renderNode(node, `${this.rootKey}_${index}`));

        return (
            <View style={this.props.containerStyle}>
                {children}
            </View>
        );
    }
}

HtmlText.propTypes = {
    html: PropTypes.string.isRequired,
    containerStyle: PropTypes.oneOfType([
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
};

export default HtmlText;
