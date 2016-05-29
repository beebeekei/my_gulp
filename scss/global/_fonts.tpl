/*
#Icon font
##SCSS file (_fonts.scss) is automaticaly generated with a Gulp using lodash template(_fonts.tpl). Don't touch it.
Font generates from SVG icons which are in 'fonts/icons' folder
All SVG icons must be of the same size: 500x500.
If they're not we have two options:
1) normalize SVG icons to make them all equal
2) ask a client to provide new SVG icons with the right size
To generate fonts from SVG icons run Gulp task
```
gulp iconfont
```
*/
@font-face {
  font-family: "<%= fontName %>";
  src: url('<%= fontPath %><%= fontName %>.eot');
  src: url('<%= fontPath %><%= fontName %>.eot?#iefix') format('eot'),
    url('<%= fontPath %><%= fontName %>.woff') format('woff'),
    url('<%= fontPath %><%= fontName %>.ttf') format('truetype'),
    url('<%= fontPath %><%= fontName %>.svg#<%= fontName %>') format('svg');
}
