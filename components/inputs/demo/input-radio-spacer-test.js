import '../input-radio-spacer.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { radioStyles } from '../input-radio-styles.js';

class TestInputRadioSpacer extends LitElement {

	static get styles() {
		return radioStyles;
	}

	render() {
		return html`
			<input type="radio" class="d2l-input-radio" aria-label="Option 1"> Option 1
			<d2l-input-radio-spacer>
				Additional content can go here and will
				line up nicely with the edge of the radio.
			</d2l-input-radio-spacer>
		`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('input');
		if (elem) elem.focus();
	}

}

customElements.define('d2l-test-input-radio-spacer', TestInputRadioSpacer);
