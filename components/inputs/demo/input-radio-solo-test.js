import { html, LitElement } from 'lit-element/lit-element.js';
import { radioStyles } from '../input-radio-styles.js';

class TestInputRadioSolo extends LitElement {

	static get properties() {
		return {
			checked: { type: Boolean },
			disabled: { type: Boolean },
			invalid: { type: Boolean }
		};
	}

	static get styles() {
		return radioStyles;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('input');
		if (elem) elem.focus();
	}

	render() {
		const invalid = this.invalid ? 'true' : 'false';
		return html`
			<input
				aria-invalid="${invalid}"
				aria-label="Option 1"
				?checked="${this.checked}"
				class="d2l-input-radio"
				?disabled="${this.disabled}"
				type="radio">
		`;
	}

}

customElements.define('d2l-test-input-radio-solo', TestInputRadioSolo);
