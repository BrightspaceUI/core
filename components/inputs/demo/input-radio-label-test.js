import { css, html, LitElement } from 'lit';
import { radioStyles } from '../input-radio-styles.js';
import { RtlMixin } from '../../../mixins/rtl/rtl-mixin.js';

class TestInputRadioLabel extends RtlMixin(LitElement) {

	static get styles() {
		return [ radioStyles,
			css`
				:host {
					display: block;
					overflow: hidden;
					width: 200px;
				}
			`
		];
	}

	render() {
		return html`
			<label class="d2l-input-radio-label">
				<input type="radio" name="myGroup" value="normal" checked>
				Option 1
			</label>
			<label class="d2l-input-radio-label">
				<input type="radio" name="myGroup" value="invalid" aria-invalid="true">
				Option 2 (invalid)
			</label>
			<label class="d2l-input-radio-label d2l-input-radio-label-disabled">
				<input type="radio" name="myGroup" value="disabled" disabled>
				Option 3 (disabled)
			</label>
			<label class="d2l-input-radio-label">
				<input type="radio" name="myGroup" value="long">
				Label for radio that wraps nicely onto
				multiple lines and stays aligned
			</label>
			<label class="d2l-input-radio-label">
				<input type="radio" name="myGroup" value="long">
				https://en.wikipedia.org/wiki/Dark_matter
			</label>
		`;
	}

}
customElements.define('d2l-test-input-radio-label', TestInputRadioLabel);
