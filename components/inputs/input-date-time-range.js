import './input-date-time.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getDateFromISODateTime, getShiftedEndDate } from '../../helpers/dateTime.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component consisting of two input-date-time components - one for start of range and one for end of range. The time input only appears once a date is selected.
 * @fires change - Dispatched when a start or end date or time is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @slot start - Optional content that would appear below the first input-date-time
 * @slot end - Optional content that would appear below the second input-date-time
 */
class InputDateTimeRange extends SkeletonMixin(FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Automatically shift end date when start date changes to keep same range
			 */
			autoShiftDates: { attribute: 'auto-shift-dates', reflect: true, type: Boolean },
			/**
			 * Hides the start and end labels visually
			 */
			childLabelsHidden: { attribute: 'child-labels-hidden', reflect: true, type: Boolean },
			/**
			 * Disables the inputs
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Label for the end input
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * Value of the end input
			 */
			endValue: { attribute: 'end-value', reflect: true, type: String },
			/**
			 * Validate on inclusive range
			 */
			inclusiveDateRange: { attribute: 'inclusive-date-range', reflect: true, type: Boolean },
			/**
			 * REQUIRED: Accessible label for the range
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the label visually
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Maximum valid date/time that could be selected by a user.
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date/time that could be selected by a user.
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Indicates that a value is required
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Label for the start input
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * Value of the start input
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String },
			_endDropdownOpened: { type: Boolean },
			_startDropdownOpened: { type: Boolean },
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date-time {
				display: block;
			}
			.d2l-input-date-time-range-start-container {
				margin-bottom: 1.2rem;
			}
			::slotted(*) {
				margin-top: 0.6rem;
			}

		`];
	}

	constructor() {
		super();

		this.autoShiftDates = false;
		this.childLabelsHidden = false;
		this.disabled = false;
		this.inclusiveDateRange = false;
		this.labelHidden = false;
		this.required = false;

		this._startDropdownOpened = false;
		this._startInputId = getUniqueId();
		this._endDropdownOpened = false;
		this._endInputId = getUniqueId();
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time-range component requires label text');
		}
	}

	render() {
		const startDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-start');
		const endDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-end');

		const tooltipStart = (this.validationError && !this._startDropdownOpened && !this.childErrors.has(startDateTimeInput)) ? html`<d2l-tooltip align="start" announced for="${this._startInputId}" position="bottom" state="error">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this._endDropdownOpened && !this.childErrors.has(endDateTimeInput)) ? html`<d2l-tooltip align="start" announced for="${this._endInputId}" position="bottom" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltipStart}
			${tooltipEnd}
			<d2l-input-fieldset
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden}"
				?required="${this.required}"
				?skeleton="${this.skeleton}">
				<div class="d2l-input-date-time-range-start-container">
					<d2l-input-date-time
						?novalidate="${this.noValidate}"
						@change="${this._handleChange}"
						class="d2l-input-date-time-range-start"
						@d2l-input-date-time-dropdown-toggle="${this._handleDropdownToggle}"
						?disabled="${this.disabled}"
						.forceInvalid=${this.invalid}
						id="${this._startInputId}"
						label="${this._computedStartLabel}"
						?label-hidden="${this.childLabelsHidden}"
						max-value="${ifDefined(this.maxValue)}"
						min-value="${ifDefined(this.minValue)}"
						?required="${this.required}"
						?skeleton="${this.skeleton}"
						value="${ifDefined(this.startValue)}">
					</d2l-input-date-time>
					<slot name="start"></slot>
				</div>
				<d2l-input-date-time
					?novalidate="${this.noValidate}"
					@change="${this._handleChange}"
					class="d2l-input-date-time-range-end"
					@d2l-input-date-time-dropdown-toggle="${this._handleDropdownToggle}"
					?disabled="${this.disabled}"
					.forceInvalid=${this.invalid}
					id="${this._endInputId}"
					label="${this._computedEndLabel}"
					?label-hidden="${this.childLabelsHidden}"
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					?required="${this.required}"
					?skeleton="${this.skeleton}"
					value="${ifDefined(this.endValue)}">
				</d2l-input-date-time>
				<slot name="end"></slot>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (this.autoShiftDates && prop === 'startValue' && this.startValue) {
				this._prevStartValue = oldVal;
			}
		});
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-date-time');
		if (input) input.focus();
	}

	async validate() {
		const startDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-start');
		const endDateTimeInput = this.shadowRoot.querySelector('.d2l-input-date-time-range-end');
		const errors = await Promise.all([startDateTimeInput.validate(), endDateTimeInput.validate(), super.validate()]);
		return [...errors[0], ...errors[1], ...errors[2]];
	}

	get validationMessage() {
		if (this.validity.badInput) {
			return this.localize('components.input-date-time-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
		}
		return super.validationMessage;
	}

	get _computedEndLabel() {
		return this.endLabel ? this.endLabel : this.localize('components.input-date-time-range.endDate');
	}

	get _computedStartLabel() {
		return this.startLabel ? this.startLabel : this.localize('components.input-date-time-range.startDate');
	}

	async _handleChange(e) {
		const elem = e.target;
		const startChanged = elem.classList.contains('d2l-input-date-time-range-start');
		if (startChanged) this.startValue = elem.value;
		else this.endValue = elem.value;
		let badInput = false;
		if (this.startValue && this.endValue) {
			if (this.inclusiveDateRange && (getDateFromISODateTime(this.endValue) < getDateFromISODateTime(this.startValue))) {
				badInput = true;
			} else if (!this.inclusiveDateRange && (getDateFromISODateTime(this.endValue) <= getDateFromISODateTime(this.startValue))) {
				badInput = true;
			}
		}
		this.setValidity({ badInput: badInput });
		await this.requestValidate(true);
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));

		if (!badInput && this.autoShiftDates && startChanged && this.endValue && this._prevStartValue) {
			this.endValue = getShiftedEndDate(this.startValue, this.endValue, this._prevStartValue, this.inclusiveDateRange);
		}
	}

	_handleDropdownToggle(e) {
		if (e.target.classList.contains('d2l-input-date-time-range-start')) {
			this._startDropdownOpened = e.detail.opened;
		} else {
			this._endDropdownOpened = e.detail.opened;
		}
	}

}
customElements.define('d2l-input-date-time-range', InputDateTimeRange);
