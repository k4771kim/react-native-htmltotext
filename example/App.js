import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import HtmlText from 'react-native-htmltotext';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    inlineNodeStyle: {
        fontSize: 18,
        color: 'black'
    },
    blockNodeStyle: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    containerStyle: {
        borderWidth: 1,
        borderColor: 'red'
    },
    browserResultStyle: {
        height: 200,
        alignSelf: 'stretch',
        width: null
    }
});

class App extends Component {
    render() {
        return (
            <ScrollView style={styles.rootContainer}>
                <HtmlText
                    html={'text<span>unsupportedtag</span><b>bold<div>unsupported nested elements</div></b><div>div1srart<b>bold</b><i>italic</i><div>div1innerstart<b>bold</b>div1innerend</div>div1end</div><div>div2</div><u>underline</u>'}
                    containerStyle={styles.containerStyle}
                    inlineNodeStyle={styles.inlineNodeStyle}
                    blockNodeStyle={styles.blockNodeStyle}
                />
                <Image resizeMode={'contain'} style={styles.browserResultStyle} source={require('./browser.png')} />
            </ScrollView>
        );
    }
}

export default App;
