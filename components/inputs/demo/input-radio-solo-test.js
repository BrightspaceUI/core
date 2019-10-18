import { html, LitElement } from 'lit-element/lit-element.js';
import { radioStyles } from '../input-radio-styles.js';

class TestInputRadioSolo extends LitElement {

	static get styles() {
		return radioStyles;
	}

	render() {
		return html`
			<input type="radio" class="d2l-input-radio" aria-label="Option 1" name="best" value="normal" checked>
			<input type="radio" class="d2l-input-radio" aria-label="Option 2 (invalid)" aria-invalid="true" name="best" value="invalid">
			<input type="radio" class="d2l-input-radio" aria-label="Option 3 (disabled)" name="best" value="disabled" disabled>
		`;
	}

}
customElements.define('d2l-test-input-radio-solo', TestInputRadioSolo);
