import { html, LitElement } from 'lit-element/lit-element.js';
import { InputTextMixin } from '../input-text-mixin.js';

class TestInputTextMixin extends InputTextMixin(LitElement) {

	render() {
		return html`<input type="text" class="d2l-input">`;
	}

}
customElements.define('d2l-test-input-text-mixin', TestInputTextMixin);
