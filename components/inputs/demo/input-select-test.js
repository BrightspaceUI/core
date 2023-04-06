import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../../mixins/rtl/rtl-mixin.js';
import { selectStyles } from '../input-select-styles.js';
import { SkeletonMixin } from '../../../components/skeleton/skeleton-mixin.js';

class TestInputSelect extends SkeletonMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Marks the input as invalid, which is shown in style and also is reflected in `aria-invalid`
			 */
			invalid: { type: Boolean },
			/**
			 * Sets a max-width on the select element in order to show overflow styles
			 */
			overflow: { type: Boolean }
		};
	}

	static get styles() {
		return [super.styles, selectStyles,
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
			<div class="d2l-skeletize">
				<select
					aria-label="Choose a dinosaur:"
					aria-invalid="${invalid}"
					class="d2l-input-select"
					?disabled="${this.disabled}">
					<option>Tyrannosaurus</option>
					<option>Velociraptor</option>
					<option>Deinonychus</option>
				</select>
			</div>
		`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('select');
		if (elem) elem.focus();
	}

}
customElements.define('d2l-test-input-select', TestInputSelect);
