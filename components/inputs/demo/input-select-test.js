import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { selectStyles } from '../input-select-styles.js';

class TestInputSelect extends RtlMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			invalid: { type: Boolean },
			overflow: { type: Boolean }
		};
	}

	static get styles() {
		return [selectStyles,
			css`
				:host {
					display: inline-block;
				}
				:host([overflow]) select {
					max-width: 130px;
				}
			`
		];
	}

	render() {
		const invalid = this.invalid ? 'true' : 'false';
		return html`
			<select
				aria-label="Choose a dinosaur:"
				aria-invalid="${invalid}"
				class="d2l-input-select"
				?disabled="${this.disabled}">
				<option>Tyrannosaurus</option>
				<option>Velociraptor</option>
				<option>Deinonychus</option>
			</select>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('select');
		if (elem) elem.focus();
	}

}
customElements.define('d2l-test-input-select', TestInputSelect);
