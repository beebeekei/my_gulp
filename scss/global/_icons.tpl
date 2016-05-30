/*doc
---
title: Icons
name: icons
category: index
---
##Icons from an icon font
_icons.tpl - is a template for _icons.scss

_icons.scss - is an automaticaly generated SCSS file. It contains:

* placeholder class %icon - it's needed for mixin icon
* function icon-char - it's needed for mixin icon
* mixin icon - you can use this mixin to insert an icon into ::before or ::after pseudo-elements. this mixin takes two parameters: icon name (file name without a char prefix), and position (before or after)
* and icon classes to use in HTML (content assets, content slots)

```html_example_table
	<style>
		.exampleOutput [class*="i-"]{
			float: left;
			font-size: 40px;
			padding: 30px;
			width: 50%;
		}

		.exampleOutput [class*="i-"]:after,
		.exampleOutput [class*="i-"]:before {
			float: right;
			padding: 0 30px;
		}
	</style>
	<% _.each(glyphs, function(glyph) { %>
	<div class='i-<%= glyph.name %>-after'><%= glyph.name %></div>
	<% }); %>
```
*/



%g-icon {
	font-family: '<%= fontName %>';
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	font-style: normal;
	font-variant: normal;
	font-weight: normal;
	speak: none;
	text-decoration: none;
	text-transform: none;
}

@function icon-char($filename) {
	$char: '';
	<% _.each(glyphs, function(glyph) { %>
	
	@if $filename == <%= glyph.name %> {
		$char: '\<%= glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase() %>';
	}<% }); %>
	
	@return $char;
}

@mixin icon($filename, $insert: before, $font-size: false) {
	
	@if $insert == before or $insert == after {
		&::#{$insert} {
			@extend %g-icon;
			
			content: icon-char($filename);
			
			@if $font-size {
				font-size: $font-size;
			}
			
		}
	} @else {
		&::before {
			@extend %g-icon;
			
			content: icon-char($filename);
			font-size: $insert;
			
		}
	}
	
}


/*
#Font icon variables
*/
<% _.each(glyphs, function(glyph) { %>
$icon-<%= glyph.name %>: '\<%= glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase() %>';
<% }); %>

<% _.each(glyphs, function(glyph) { %>
.i-<%= glyph.name %>-before {
	@include icon(<%= glyph.name %>);
}

.i-<%= glyph.name %>-after {
	@include icon(<%= glyph.name %>, after);
}

<% }); %>
