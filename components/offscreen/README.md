# Offscreen Content

Positioning content offscreen is a valuable accessibility technique when you wish to have content which is only visible to screen readers. For more information on this approach, read [WebAIM's article on Invisible Content](http://webaim.org/techniques/css/invisiblecontent/).

## Web Component

Import and use the `<d2l-offscreen>` web component, the contents of which will be positioned offscreen.

```html
<!-- docs: live demo -->
<script type="module">
  import '@brightspace-ui/core/components/offscreen/offscreen.js';
</script>
<p>On-screen content</p>
<d2l-offscreen>Offscreen content.</d2l-offscreen>
```

## Applying offscreen styles to arbitrary elements

Alternately, you can apply offscreen styles to any element by importing the styles into your element and placing the `d2l-offscreen` CSS class on it.

```javascript
import { offscreenStyles } from './offscreen.js';

class MyElement extends LitElement {

  static get styles() { return [ offscreenStyles ] }

  render() {
    return html`
      <p>On-screen content</p>
      <p class="d2l-offscreen">offscreen content</p>
    `;
  }

}
```
