/*
#Icons from a icon font
_icons.tpl - is a template for _icons.scss
_icons.scss - is an automaticaly generated SCSS file. It contains:
- placeholder class %icon - it's needed for mixin icon
- function icon-char - it's needed for mixin icon
- mixin icon - you can use this mixin to insert an icon into :before or :after pseudo-elements. this mixin takes two parameters: icon name (file name without a char prefix), and position (before or after)
- and icon classes to use in HTML (content assets, content slots)
*/
%icon {
  font-family: "<%= fontName %>";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  speak: none;
  text-decoration: none;
  text-transform: none;
}

@function icon-char($filename) {
  $char: "";
<% _.each(glyphs, function(glyph) { %>
  @if $filename == <%= glyph.name %> {
    $char: "\<%= glyph.codepoint.toString(16) %>";
  }<% }); %>

  @return $char;
}

@mixin icon($filename, $insert: before) {
  &:#{$insert} {
    @extend %icon;
    content: icon-char($filename);
  }
}

/*
#Font icon variables
*/
<% _.each(glyphs, function(glyph) { %>
$icon-<%= glyph.name %>: '\<%= glyph.codepoint.toString(16) %>';
<% }); %>

<% _.each(glyphs, function(glyph) { %>
.i-<%= glyph.name %>-before {
  @include icon(<%= glyph.name %>);
}
.i-<%= glyph.name %>-after {
  @include icon(<%= glyph.name %>, after);
}
<% }); %>
