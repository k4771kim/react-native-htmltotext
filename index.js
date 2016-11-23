import React, { Component } from 'react';
import { View } from 'react-native';

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
        const children = this.state.fragment.childNodes.map((node, index) => processNode(node, `${this.rootKey}_${index}`));

        return (
            <View style={[styles.container, this.props.style]}>
                {children}
            </View>
        );
    }
}

HtmlText.propTypes = {
    html: React.PropTypes.string,
    style: View.propTypes.style
};

export default HtmlText;
