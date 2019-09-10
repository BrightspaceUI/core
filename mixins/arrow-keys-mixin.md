# ArrowKeysMixin

Used for managing focus with the arrow keys.

right/down - focuses next element, or first if currently at the end
left/up - focuses previous element, or last if currently at beginning
home - focuses first
end - focuses last

# Usage

```
class MyElement extends ArrowKeysMixin(LitElement) {

   constructor() {
      super();
      this.arrowKeysDirection = '';  // optionally override default: ['leftright', 'updown', or any string combination of arrow keys you wish to allow]
      this.arrowKeysNoWrap = true;  // optionally override default: [true, false]
   }

   render() {
      const inner = html`
         <a href="..." class="d2l-arrowkeys-focusable">link 1</a>
         <a href="..." class="d2l-arrowkeys-focusable">link 2</a>
         // etc
      `;
      return html`
         <div class="some-outer-html">
            ...
            ${this.arrowKeysContainer(inner)}
            ...
         </div>
      `;
   }

   async arrowKeysBeforeFocus() {
      // consumer optionally implements
   }

	/*
	async focusablesProvider() {
		// consumer optionally implements to override which elements are considered focusable
		// in the default case, 'inner' elements with the 'd2l-arrowkeys-focusable' class are considered focusable

		// example of an override that gets particular slotted tags
		const listOfFocusableElements = getComposedChildren(this.shadowRoot.querySelector('slot')).filter((tag) => {
			return tag.nodeName === 'D2L-TAG-I-WANT';
		}) || [];
		return listOfFocusableElements;
	}
	*/
}
customElements.define('my-element', MyElement);
```
