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
	  button:hover,
	  button:focus {
		  /* styles to apply when clicked or focused with a keybard */
		  background-color: #cccccc;
	  }
	  button.focus-visible {
		  /* styles to apply only when focused with a keyboard */
		  outline: 2px solid black;
	  }
    `;
  }
}
```

**Learn More:** [focus-visible polyfill documentation](https://github.com/WICG/focus-visible)
