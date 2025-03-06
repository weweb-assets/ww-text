---
name: ww-text
description: HTML text component with multi-language support
keywords:
  - text
  - multilang
  - html
  - paragraph
  - heading
---

#### ww-text
Props:
- text: object - Text content. An object can be used for multi-language support (e.g., `{ "en": "Hello", "fr": "Bonjour" }`). `text` itself is not bindable but each lang inside are, ex: `"text": { "en": {"wwFormula":...}, "fr": {"wwFormula":...} }`
- tag: p|h1|h2|h3|h4|button|div - HTML element type

Events: none

Variables: none

Children: none

Note: For binding the text props, use binding in each language (e.g., `"text": { "en": {"wwFormula":...}, "fr": {"wwFormula":...} }`). Available languages can be found in Page Info variable.
Important: ALWAYS set the `textAlign` css property in the styles key.

*** CRITICAL RULE - NO EXCEPTIONS ***: For binding the text props, use binding in each language (e.g., `"text": { "en": {"wwFormula":...}, "fr": {"wwFormula":...} }`). Available languages can be found in Page Info variable.
✅ This applies every time you use ww-text component
🔴 Missing language bindings on the language key will break the project

*** CRITICAL RULE - NO EXCEPTIONS ***: ALWAYS set the `textAlign` css property in the styles key.
✅ This appy every time you use ww-text component
🔴 Missing `textAlign` cause unexpected layout issues