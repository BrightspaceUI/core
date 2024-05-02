import '../input-radio-spacer.js';
import { html, LitElement } from 'lit';
import { bodySmallStyles } from '../../typography/styles.js';
import { radioStyles } from '../input-radio-styles.js';

class TestInputRadioSpacer extends LitElement {

	static get styles() {
		return [ radioStyles, bodySmallStyles ];
	}

	render() {
		return html`
			<div>
				<label class="d2l-input-radio-label">
					<input type="radio" name="myGroup" value="normal" checked>
					Option 1
				</label>
				<d2l-input-radio-spacer>
					Additional content can go here and will line up nicely with the edge of the radio.
				</d2l-input-radio-spacer>
			</div>
			<div>
				<label class="d2l-input-radio-label">
					<input type="radio" name="myGroup" value="normal">
					Option 1 (A really really long label that will wrap to the next line where the indentation will be applied. All the text should align.)
				</label>
				<d2l-input-radio-spacer>
					Additional content can go here and will line up nicely with the edge of the radio.
				</d2l-input-radio-spacer>
			</div>
			<div>
				<label class="d2l-input-radio-label">
					<input type="radio" name="myGroup" value="normal">
					Option 1
				</label>
				<d2l-input-radio-spacer>
					<div class="d2l-body-small">Additional content can go here and will line up nicely with the edge of the radio.</div>
				</d2l-input-radio-spacer>
			</div>
		`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('input');
		if (elem) elem.focus();
	}

}

customElements.define('d2l-test-input-radio-spacer', TestInputRadioSpacer);
