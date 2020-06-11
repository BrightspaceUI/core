import { html, LitElement } from 'lit-element/lit-element.js';
import { duplicateOffscreen } from '../../../directives/duplicate-offscreen.js';

class DuplicateDemo extends LitElement {
	render() {
		const item = html`<div>This message is present in the DOM twice</div>`;

		return html`
			${duplicateOffscreen(item)}
		`;
	}
}

customElements.define('d2l-duplicate-demo', DuplicateDemo);
