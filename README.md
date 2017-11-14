# react-native-htmltotext

### Render html string using Text and View components
#### Nesting of block element inside inline element is not supported
#### Supported elements are u, b, i and div

## Example

input:
```html
text<span>unsupportedtag</span><b>bold<div>unsupported nested elements</div></b><div>div1srart<b>bold</b><i>italic</i><div>div1innerstart<b>bold</b>div1innerend</div>div1end</div><div>div2</div><u>underline</u>
```
output:
![native](/example/native.png)
