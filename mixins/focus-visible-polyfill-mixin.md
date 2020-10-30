# FocusVisiblePolyfillMixin

From [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible):

> The `:focus-visible` pseudo-class applies while an element matches the `:focus` pseudo-class and the user agent determines via heuristics that the focus should be made evident on the element.

In order words, it allows you to provide focus styles for an element that only get applied when the user accessed it via keyboard. But today only Chrome supports `:focus-visible`, so a polyfill is required.

The `FocusVisiblePolyfillMixin` adds support to a component to use the [focus-visible polyfill](https://github.com/WICG/focus-visible), ensuring that the polyfill is lazy loaded only once and that it's properly applied to the component's shadow root.

## Usage

Apply the mixin and target the `focus-visible` CSS class for styles you'd like to apply when focus should be visible. 

```js
import { FocusVisiblePolyfillMixin } from '@brightspace-ui/core/mixins/focus-visible-polyfill-mixin.js';

class MyComponent extends FocusVisiblePolyfillMixin(LitElement) {
  static get styles() {
    return css`
      /* styles to apply when clicked or focused with a keybard */
      button:hover,
      button:focus {
        background-color: #cccccc;
      }
      /* styles to apply only when focused with a keyboard */
      button.focus-visible {
        outline: 2px solid black;
      }
    `;
  }
}
```

**Learn More:** [focus-visible polyfill documentation](https://github.com/WICG/focus-visible)

## Forcing Visible Focus

When applying focus programatically in JavaScript via `elem.focus()`, unless a `Tab` keyboard event has just occurred, a visible focus ring will not be shown. In certain circumstances, forcing focus to be visible is desired -- like when moving focus from one element to another.

For example, opening a dialog moves the user's focus from an opener to inside the dialog and then closing the dialog moves it back to the opener. In cases like this, not being able to clearly see which element has focus can be disorienting for the user.

To force visible focus, use the `forceFocusVisible()` helper:

```js
import { forceFocusVisible } from '@brightspace-ui/core/helpers/focus.js';

// focus and force a visible focus ring
forceFocusVisible(elem);
```