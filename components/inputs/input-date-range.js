
import './input-date.js';
import './input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputDateRange extends RtlMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			endValue: { attribute: 'end-value', reflect: true, type: String },
			label: { type: String },
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			minValue: { attribute: 'min-value', reflect: true, type: String },
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			startValue: { attribute: 'start-value', reflect: true, type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				padding-right: 1rem;
				padding-top: 0.25rem;
			}
			:host([dir="rtl"]) d2l-input-date {
				padding-left: 1rem;
				padding-right: 0;
				padding-top: 0.25rem;
			}
		`;
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-range component requires label text');
		}
	}

	render() {
		const startLabel = this.startLabel ? this.startLabel : this.localize('components.input-date-range.startDate');
		const endLabel = this.endLabel ? this.endLabel : this.localize('components.input-date-range.endDate');
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}">
				<d2l-input-date
					@change="${this._handleChange}"
					class="d2l-input-date-range-start"
					?disabled="${this.disabled}"
					label="${startLabel}"
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					value="${ifDefined(this.startValue)}">
				</d2l-input-date>
				<d2l-input-date
					@change="${this._handleChange}"
					class="d2l-input-date-range-end"
					?disabled="${this.disabled}"
					label="${endLabel}"
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					value="${ifDefined(this.endValue)}">
				</d2l-input-date>
			</d2l-input-fieldset>
		`;
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-date');
		if (input) input.focus();
	}

	async _handleChange(e) {
		// TODO: validation that start is before end
		const elem = e.target;
		if (elem.classList.contains('d2l-input-date-range-start')) this.startValue = elem.value;
		else this.endValue = elem.value;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date-range', InputDateRange);
