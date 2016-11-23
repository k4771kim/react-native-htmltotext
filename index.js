import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Parser } from 'parse5';

import processNode from './processNode';
import styles from './styles';

class HtmlText extends Component {
    constructor(props) {
        super(props);
        this.parser = new Parser();
        this.rootKey = 'ht_';

        this.state = {
            fragment: this.parser.parseFragment(props.html)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.html !== nextProps.html) {
            this.setState({
                fragment: this.parser.parseFragment(nextProps.html)
            });
        }
    }

    render() {
        const Container = this.props.container;
        const children = this.state.fragment.childNodes.map((node, index) => processNode(node, `${this.rootKey}_${index}`, this.props.textStyle));

        return (
            <Container style={this.props.containerStyle}>
                {children}
            </Container>
        );
    }
}

HtmlText.propTypes = {
    container: React.PropTypes.func.isRequired,
    html: React.PropTypes.string.isRequired,
    containerStyle: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array,
        React.PropTypes.number,
    ]),
    textStyle: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array,
        React.PropTypes.number,
    ])
};

HtmlText.defaultProps = {
    container: Text
};

export default HtmlText;
