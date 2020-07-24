import './input-date.js';
import './input-fieldset.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { FormElementMixin, ValidationType } from '../form/form-element-mixin.js';
import { getDateFromISODate } from '../../helpers/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component consisting of two input-date components - one for start of range and one for end of range. Values specified for these components (through start-value and/or end-value attributes) should be localized to the user's timezone if applicable and must be in ISO 8601 calendar date format ("YYYY-MM-DD").
 * @fires change - Dispatched when a start or end date is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 calendar date format ("YYYY-MM-DD").
 */
class InputDateRange extends FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * Disables the inputs
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Label for the end date input
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * Value of the end date input
			 */
			endValue: { attribute: 'end-value', reflect: true, type: String },
			/**
			 * REQUIRED: Accessible label for the range
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the label visually
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Maximum valid date that could be selected by a user
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date that could be selected by a user
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Label for the start date input
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * Value of the start date input
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String },
			_endCalendarOpened: { attribute: false, type: Boolean },
			_startCalendarOpened: { attribute: false, type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				margin-bottom: -1.2rem;
				margin-right: -1.5rem;
			}
			:host([dir="rtl"]) {
				margin-left: -1.5rem;
				margin-right: 0;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				display: inline-block;
				margin-bottom: 1.2rem;
			}
			d2l-input-date.d2l-input-date-range-start {
				margin-right: 1.5rem;
			}
			:host([dir="rtl"]) d2l-input-date.d2l-input-date-range-start {
				margin-left: 1.5rem;
				margin-right: 0;
			}
		`;
	}

	constructor() {
		super();

		this.disabled = false;
		this.labelHidden = false;

		this._startCalendarOpened = false;
		this._startInputId = getUniqueId();
		this._endCalendarOpened = false;
		this._endInputId = getUniqueId();
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-range component requires label text');
		}
	}

	render() {
		const tooltipStart = (this.validationError && !this._startCalendarOpened) ? html`<d2l-tooltip align="start" for="${this._startInputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this._endCalendarOpened) ? html`<d2l-tooltip align="start" for="${this._endInputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltipStart}
			${tooltipEnd}
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?label-hidden="${this.labelHidden}">
				<d2l-input-date
					@change="${this._handleChange}"
					class="d2l-input-date-range-start"
					@d2l-form-element-should-validate="${this._handleNestedFormElementValidation}"
					@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					.forceInvalid=${this.invalid}
					id="${this._startInputId}"
					label="${this._computedStartLabel}"
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					value="${ifDefined(this.startValue)}">
				</d2l-input-date>
				<d2l-input-date
					@change="${this._handleChange}"
					class="d2l-input-date-range-end"
					@d2l-form-element-should-validate="${this._handleNestedFormElementValidation}"
					@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					.forceInvalid=${this.invalid}
					id="${this._endInputId}"
					label="${this._computedEndLabel}"
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

	async validate(validationType) {
		const childErrors = await Promise.all([
			this.shadowRoot.querySelector('.d2l-input-date-range-start').validate(validationType),
			this.shadowRoot.querySelector('.d2l-input-date-range-end').validate(validationType)]
		).then(res => res.reduce((acc, errors) => [...acc, ...errors], []));
		const errors = await super.validate(childErrors.length > 0 ? ValidationType.SUPPRESS_ERRORS : validationType);
		return [...errors, ...childErrors];
	}

	get validationMessageBadInput() {
		return this.localize('components.input-date-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
	}

	get _computedEndLabel() {
		return this.endLabel ? this.endLabel : this.localize('components.input-date-range.endDate');
	}

	get _computedStartLabel() {
		return this.startLabel ? this.startLabel : this.localize('components.input-date-range.startDate');
	}

	async _handleChange(e) {
		const elem = e.target;
		if (elem.classList.contains('d2l-input-date-range-start')) {
			this.startValue = elem.value;
		} else {
			this.endValue = elem.value;
		}
		this.setValidity({badInput: (this.startValue && this.endValue && (getDateFromISODate(this.endValue) <= getDateFromISODate(this.startValue)))});
		await this.requestValidate();
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleDropdownToggle(e) {
		if (e.target.classList.contains('d2l-input-date-range-start')) {
			this._startCalendarOpened = e.detail.opened;
		} else {
			this._endCalendarOpened = e.detail.opened;
		}
	}

	_handleNestedFormElementValidation(e) {
		e.preventDefault();
	}

}
customElements.define('d2l-input-date-range', InputDateRange);
