import { html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from '../button-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class TestButtonElem extends ButtonMixin(LitElement) {
	render() {
		return html`
			<button aria-label="${ifDefined(this.getAriaLabel())}">Test Button</button>
		`;
	}
}

customElements.define('test-button-elem', TestButtonElem);
