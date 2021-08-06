import { html, LitElement } from 'lit-element/lit-element.js';
import { radioStyles } from '../input-radio-styles.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';

class TestInputRadioLabelSimple extends RtlMixin(LitElement) {

	static get styles() {
		return [ radioStyles ];
	}

	render() {
		return html`
			<label class="d2l-input-radio-label">
				<input type="radio" name="myGroup" value="first" checked>
				Option 1
			</label>
			<label class="d2l-input-radio-label">
				<input type="radio" name="myGroup" value="second">
				Option 2
			</label>
		`;
	}

}
customElements.define('d2l-test-input-radio-label-simple', TestInputRadioLabelSimple);
