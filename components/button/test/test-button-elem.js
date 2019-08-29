import { html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from '../button-mixin.js';

class TestButtonElem extends ButtonMixin(LitElement) {
	render() {
		return html`
			<button>Test Button</button>
		`;
	}
}

customElements.define('test-button-elem', TestButtonElem);
