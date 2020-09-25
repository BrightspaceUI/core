# Skeletons

Skeletons provide a low fidelity representation of an application before it has finished loading, improving the user's perception of performance.

![skeleton overview](./screenshots/overview.png?raw=true)

## Skeleton-Aware Components

Components which are skeleton-aware extend the `SkeletonMixin` (more on that below). These components can be skeletized by setting the `skeleton` boolean attribute/property.

For example, this causes a text input to be skeletized:

```html
<d2l-input-text label="Name" skeleton></d2l-input-text>
```

![skeleton text input](./screenshots/text-input.png?raw=true)

In a typical scenario, many skeleton-aware components would have their `skeleton` attributes bound to a single property on the host component, making it easy to toggle them all together:

```html
<d2l-input-text label="Name" ?skeleton="${this.skeleton}"></d2l-text-input>
<d2l-input-date label="Due Date" ?skeleton="${this.skeleton}"></d2l-input-date>
<my-element ?skeleton="${this.skeleton}"></my-element>
```

## Skeletizing Custom Elements with SkeletonMixin

For a component to become skeleton-aware, it extends `SkeletonMixin`. The mixin comes with some styles, so include `super.styles` with your element's static `styles()` property.

```javascript
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class MyElement extends SkeletonMixin(LitElement) {

  static get styles() {
    return [ super.styles, ... ];
  }

}
```

The mixin includes a single `skeleton` boolean property, which can then be set either by consumers or by your component itself to place it into "skeleton" mode:

```html
<my-element skeleton></my-element>
```

## Skeletizing Native Elements

Once a component is skeleton-aware, it can apply skeleton styles to native elements within its render root using the `d2l-skeletize` CSS class. These native elements can be anything, including our own headings, links and standard/compact/small body styles.

```javascript
render() {
  return html`
    <h2 class="d2l-heading-2 d2l-skeletize">Heading</h2>
    <span class="d2l-body-compact d2l-skeletize">Description</span>
    <a class="d2l-link d2l-skeletize" href="somewhere">Link</a>
    <div class="widget d2l-skeletize">Widget</div>
    <d2l-input-text label="text input" ?skeleton="{this.skeleton}"></d2l-input-text>
  `;
}
```

**Important:** Only use this CSS class on native elements. Custom elements should extend the `SkeletonMixin` and have their `skeleton` attribute set. If a custom element isn't skeleton-aware and doesn't yet have a `skeleton` property, take the time to add that support.

## Multi-Line Paragraphs

Paragraphs of text that may span multiple lines are a special case for skeletons. The `d2l-skeletize` CSS class would turn the entire paragraph block into a skeleton box, which isn't quite what we want. Also, often we're showing a skeleton because we don't yet know how much data we'll have.

Ideally, we'd like to show several lines of skeletized text, like this:

![skeleton text input](./screenshots/paragraph.png?raw=true)

To accomplish this, three special CSS classes exist to provide skeletons that span 2, 3 or 5 lines: `d2l-skeletize-paragraph-2`, `d2l-skeletize-paragraph-3` and `d2l-skeletize-paragraph-5` respectively.

Apply one of these classes plus any additional (optional) typography styles for your paragraph:

```html
<p class="d2l-body-compact d2l-skeletize-paragraph-2">2-line</p>
<p class="d2l-skeletize-paragraph-3">3-line</p>
<p class="d2l-body-standard d2l-skeletize-paragraph-5">5-line</p>
```

Work with your designer to choose an appropriate number of lines to display based on the expected size of the paragraph.

## Skeleton Width of Block Elements

When skeleton styles are applied to block elements like `<div>`s and headings, the skeleton will fill the entire available width. Sometimes this is desired (like in the case of a box-like widget or container), but in other scenarios we'd like the skeleton to only partially fill the available width.

One solution is to make these elements `inline` or `inline-block` instead of `block`. If that's feasible, it's a great solution and has the added benefit that the skeleton's width will match the width of the text inside.

If making the element inline is not possible, a series of CSS classes in the form of `d2l-skeletize-<width>` can be used. `<width>` is a number from `5` to `95` in steps of `5` -- `d2l-skeletize-5`, `d2l-skeletize-10`, `d2l-skeletize-15`, etc. all the way to `d2l-skeletize-95`. When used, a `width: <value>%` will be applied as a percentage, but ONLY when the skeleton is visible.

For example:

```html
<h2 class="d2l-heading-2 d2l-skeletize d2l-skeletize-45">Heading</h2>
```

When skeletized, this heading will take up `45%` of the available width.

## Future Enhancements

Looking for an enhancement not listed here? Is there a core component that should support skeletons but doesn't yet? Create a GitHub issue!
