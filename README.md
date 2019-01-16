# react-native-htmltotext

### Render html string using Text and View components by using [parse5](https://github.com/inikulin/parse5) to parse the html

#### Nesting of block element inside inline element is not supported

#### Supported elements are u, b, i and div

## Example

input:

```html
text<span>unsupportedtag</span
><b
  >bold
  <div>unsupported nested elements</div></b
>
<div>
  div1srart<b>bold</b><i>italic</i>
  <div>div1innerstart<b>bold</b>div1innerend</div>
  div1end
</div>
<div>div2</div>
<u>underline</u>
```

```jsx
<HtmlText
  html={"the html as a string"}
  inlineNodeStyle={{ fontSize: 18, color: "black" }}
  blockNodeStyle={{ flexDirection: "column", justifyContent: "center" }}
/>
```

output: ![native](/example/native.png)
