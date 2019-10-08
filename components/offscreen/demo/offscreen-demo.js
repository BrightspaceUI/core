import { html, LitElement } from 'lit-element/lit-element.js';
import { offscreenStyles } from '../offscreen-styles.js';

class OffscreenDemo extends LitElement {

	static get styles() {
		return offscreenStyles;
	}

	render() {
		return html`<span class="d2l-offscreen">This message will only be visible to assistive technology, such as a screen reader.</span>`;
	}

}

customElements.define('d2l-offscreen-demo', OffscreenDemo);
