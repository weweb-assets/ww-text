import Quill from 'quill';
import Line from './Line.js';
import ListItemColor from './ListItemColor.js';
import ListItemFont from './ListItemFont.js';
import ListItemSize from './ListItemSize.js';
import ListItemStyle from './ListItemStyle.js';
import wwLink from './wwLink.js';

Quill.register(Line, true);
Quill.register(ListItemColor, true);
Quill.register(ListItemFont, true);
Quill.register(ListItemSize, true);
Quill.register(ListItemStyle, true);
Quill.register(wwLink, true);

const Parchment = Quill.import('parchment');

// FONT SIZE
const fontSize = new Parchment.Attributor.Class('fontSize', 'ww-font-size', { scope: Parchment.Scope.INLINE });
Quill.register(fontSize, true);

// FONT
const font = new Parchment.Attributor.Style('font', 'font-family', { scope: Parchment.Scope.INLINE });
Quill.register(font, true);

// ALIGN
const align = new Parchment.Attributor.Style('align', 'text-align', { scope: Parchment.Scope.BLOCK });
Quill.register(align, true);

// INDENT
const indent = new Parchment.Attributor.Style('indent', 'padding-left', { scope: Parchment.Scope.BLOCK });
Quill.register(indent, true);

// LETTER SPACING
const letterSpacing = new Parchment.Attributor.Style('letterSpacing', 'letter-spacing', {
    scope: Parchment.Scope.INLINE,
});
Quill.register(letterSpacing, true);

// LINE HEIGHT
const lineHeight = new Parchment.Attributor.Style('lineHeight', 'line-height', { scope: Parchment.Scope.BLOCK });
Quill.register(lineHeight, true);

// FONT WEIGHT
const fontWeight = new Parchment.Attributor.Style('fontWeight', 'font-weight', { scope: Parchment.Scope.INLINE });
Quill.register(fontWeight, true);

// LIST TYPE
const listType = new Parchment.Attributor.Attribute('listType', 'type', { scope: Parchment.Scope.BLOCK });
Quill.register(listType, true);
