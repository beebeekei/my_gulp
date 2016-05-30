/**
 * @license
 * MyFonts Webfont Build ID 3200312, 2016-04-07T11:42:21-0400
 * 
 * The fonts listed in this notice are subject to the End User License
 * Agreement(s) entered into by the website owner. All other parties are 
 * explicitly restricted from using the Licensed Webfonts(s).
 * 
 * You may obtain a valid license at the URLs below.
 * 
 * Webfont: EngraversGothicBT by ParaType
 * URL: http://www.myfonts.com/fonts/paratype/engravers-gothic/regular/
 * Copyright: Copyright &#x00A9; 1987-1992 Bitstream Inc. Partial Copyright &#x00A9; 2005, ParaType Inc, ParaType Ltd. All rights reserved.
 * Licensed pageviews: 500,000
 * 
 * 
 * License: http://www.myfonts.com/viewlicense?type=web&buildid=3200312
 * 
 * © 2016 MyFonts Inc
*/

/* @import must be at top of file, otherwise CSS will not work */
@import url("//hello.myfonts.net/count/30d538");

@font-face {
	font-family: 'EngraversGothicBT';
	src: url('../fonts/30D538_0_0.eot');
	src: url('../fonts/30D538_0_0.eot?#iefix') format('embedded-opentype'),
		url('../fonts/30D538_0_0.woff2') format('woff2'),
		url('../fonts/30D538_0_0.woff') format('woff'),
		url('../fonts/30D538_0_0.ttf') format('truetype');
}

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
	font-family: '<%= fontName %>';
	src: url('<%= fontPath %><%= fontName %>.eot');
	src: url('<%= fontPath %><%= fontName %>.eot?#iefix') format('eot'),
		url('<%= fontPath %><%= fontName %>.woff') format('woff'),
		url('<%= fontPath %><%= fontName %>.ttf') format('truetype'),
		url('<%= fontPath %><%= fontName %>.svg#<%= fontName %>') format('svg');
}

