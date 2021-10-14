# Off-screen Content [d2l-offscreen]

Positioning content off-screen is a valuable accessibility technique that allows us to include content that is only visible to screen reader users. For more information on this approach, read [WebAIM's article on Invisible Content](http://webaim.org/techniques/css/invisiblecontent/).

Import the `<d2l-offscreen>` web component and place your content within the default slot to position it off-screen. The content will be hidden in the UI but still discoverable by screen reader users.

<!-- docs: demo live name:d2l-offscreen -->
```html
<!-- docs: start hidden content -->
<style>
  p {
    font-size: .8rem;
    max-width: 12rem;
    text-align: center;
    margin: 0 !important;
  }
</style>
<!-- docs: end hidden content -->
<script type="module">
  import '@brightspace-ui/core/components/offscreen/offscreen.js';
</script>
<p>This demo has off-screen content visible only to screen readers</p>
<d2l-offscreen>Off-screen content for screen readers only</d2l-offscreen>
```

## Applying off-screen styles to arbitrary elements

Alternately, you can apply off-screen styles to any element by importing the styles into your element and placing the `d2l-offscreen` CSS class on it.

```javascript
import { offscreenStyles } from './offscreen.js';

class MyElement extends LitElement {

  static get styles() { return [ offscreenStyles ] }

  render() {
    return html`
      <p>On-screen content</p>
      <p class="d2l-offscreen">Off-screen content</p>
    `;
  }
}
```

<!-- docs: start hidden content -->
## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
