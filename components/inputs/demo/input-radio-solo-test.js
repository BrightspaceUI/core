import { html, LitElement } from 'lit-element/lit-element.js';
import { radioStyles } from '../input-radio-styles.js';

class TestInputRadioSolo extends LitElement {

	static get properties() {
		return {
			/**
			 * Selection state
			 */
			checked: { type: Boolean },
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Marks the input as invalid, which is shown in style and also is reflected in `aria-invalid`
			 */
			invalid: { type: Boolean }
		};
	}

	static get styles() {
		return radioStyles;
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

	focus() {
		const elem = this.shadowRoot.querySelector('input');
		if (elem) elem.focus();
	}

}

customElements.define('d2l-test-input-radio-solo', TestInputRadioSolo);
