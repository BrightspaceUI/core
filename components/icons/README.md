# Icons

The `<d2l-icon>` web component can be used in your applications to embed one of the roughly 500 preset SVG icons that make up the Brightspace iconography set.

For custom SVGs not part of our iconography set, use the `<d2l-icon-custom>` web component.

## Preset Icons

For preset icons, import and use the `<d2l-icon>` web component with the `icon` attribute.

```html
<script type="module">
  import '@brightspace-ui/core/components/icons/icon.js';
</script>
<d2l-icon icon="tier1:gear"></d2l-icon>
```

The `icon` attribute value is of the form `<category-name>:<icon-name>`. The icon will automatically be the correct color (ferrite) and size based on its category.

**Note:** Always choose the icon whose native size best matches your desired icon size, ideally exactly.

| Category Name | Description | Samples | Size | List |
| :----: | --- | :---: | :---: | :---: |
| tier1 | minimal level of detail, solid style | ![print](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier1/print.svg?sanitize=true)&nbsp;&nbsp; ![gear](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier1/gear.svg?sanitize=true)&nbsp;&nbsp; ![save](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier1/save.svg?sanitize=true) | `18px` x `18px` | [Full set](catalogue.md#tier1) |
| tier2 | medium level of detail, linear style | ![audio](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier2/file-audio.svg?sanitize=true)&nbsp;&nbsp; ![copy](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier2/copy.svg?sanitize=true)&nbsp;&nbsp; ![news](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier2/news.svg?sanitize=true) | `24px` x `24px` | [Full set](catalogue.md#tier2) |
| tier3 | medium level of detail, linear style | ![notifications](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier3/notification-bell.svg?sanitize=true)&nbsp;&nbsp; ![help](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier3/help.svg?sanitize=true)&nbsp;&nbsp; ![search](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/tier3/search.svg?sanitize=true) | `30px` x `30px` | [Full set](catalogue.md#tier3) |
| html-editor | for use in the HTML editor | ![](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/html-editor/bold.svg?sanitize=true)&nbsp;&nbsp; ![](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/html-editor/indent-decrease.svg?sanitize=true)&nbsp;&nbsp; ![](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/html-editor/source-editor.svg?sanitize=true) | `18px` x `18px` | [Full set](catalogue.md#html-editor) |
| emoji | for all your emoji needs, same detail/style as tier1 | ![](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/emoji/lol.svg?sanitize=true)&nbsp;&nbsp; ![](https://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/emoji/happy.svg?sanitize=true)&nbsp;&nbsp; ![](hhttps://raw.githubusercontent.com/BrightspaceUI/core/master/components/icons/images/emoji/angry.svg?sanitize=true) | `18px` x `18px` | [Full set](catalogue.md#emoji) |

**[&gt; Browse ALL categories and icons](catalogue.md)**

## Custom SVG Icons

To use a custom SVG icon, embed the SVG inside a `<d2l-icon-custom>` element and set the `size` attribute to one of: `tier1`, `tier2` or `tier3`.

```html
<script type="module">
  import '@brightspace-ui/core/components/icons/icon-custom.js';
</script>
<d2l-icon-custom size="tier1">
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#494c4e" d="..."/>
  </svg>
</d2l-icon-custom>
```

Ensure that the SVG is formatted according to [the rules outlined below](#svg-format).

## Overriding the Color

To change an icon's color from ferrite to something else, simply set it from CSS:

```html
<d2l-icon icon="tier3:alert" style="color: red;"></d2l-icon>
```

## Overriding the Size

Overriding the size is not recommended. However, if you must, set the `width` and `height` from CSS. For this to work in IE11, it **must** be done from inside another web component.

## Updating or contributing new icons

### First, do you need to contribute?

Before contributing to our shared set of icons, ask yourself whether your new icon is common enough to be included here. Will it be used in many other applications, or is it unique to yours?

To keep our icon sets manageable, only icons that have the potential to be reused many times should be a part of this collection.

### SVG format

When contributing changes to icons, the SVG files should be properly formatted. This ensures that they will render at the correct size and in the correct color across all browsers. Follow these rules:
- native icon sizes need to be one of: 18, 24 or 30
- the `<svg>` element must:
  - have a `width` and `height` attribute which match the native size
  - not have an `id` or `data-name` attribute
- the `<svg>`'s `viewBox` attribute must:
  - have an origin beginning at `0 0`
  - be exactly square (e.g. `0 0 18 18`)
  - match the icon's native size
  - not contain negative values
- there should be no `<title>` element
- there should be no inline `<style>` -- all style for line fills should be applied directly to the SVG elements
- color of SVG elements should be "ferrite" (`#494c4e`)

The best way to have most of these rules applied for you automatically is to put the icon through [SVGOMG](https://jakearchibald.github.io/svgomg/) with the "remove title" and "prettify code" options selected.

Here's a sample of a properly formatted SVG:

```svg
<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <path fill="#494c4e" d="..."/>
</svg>
```

### Auto-generated files

The `catalogue.md` catalogue file is automatically generated. When making icon modifications, re-generate this file by running `npm run build:icons`.

### Bidirectionality

When rendered in a right-to-left direction, any icons which show directionality in terms of time (back/forward, next/previous, etc.) need to be mirrored horizontally. If the underlying `<svg>` element has a `mirror-in-rtl` attribute set, the `<d2l-icon>` component will do this automatically.

```svg
<svg mirror-in-rtl="true" ...>
  ...
</svg>
```

To learn more about how best to determine if an icon should be mirrored, refer to [Google's Material Design Bidirectionality](https://material.google.com/usability/bidirectionality.html) documentation.

## File Icon Type Helper

Helper functions that return a file icon type based on the given file extension or filename string. Returns string of form `file-` + type, corresponding to an icon name for the `<d2l-icon>` component.

```js
import { getFileIconTypeFromExtension, getFileIconTypeFromFilename } from '@brightspace-ui/core/helpers/getFileIconType.js';

getFileIconTypeFromExtension('docx'); // returns 'file-document'
getFileIconTypeFromFilename('MY_SONG.MP3'); // returns 'file-audio'

```


## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
