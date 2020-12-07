import './input-date.js';
import './input-date-time-range-to.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateTimeInISO, getDateFromISODate, parseISODateTime } from '../../helpers/dateTime.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export function getShiftedEndDate(startValue, endValue, prevStartValue, inclusive) {
	const jsStartDate = new Date(startValue);
	const jsEndDate = new Date(endValue);
	const jsPrevStartDate = new Date(prevStartValue);
	if ((inclusive && jsEndDate.getTime() - jsPrevStartDate.getTime() < 0)
		|| (!inclusive && jsEndDate.getTime() - jsPrevStartDate.getTime() <= 0))
		return endValue;

	const diff = jsStartDate.getTime() - jsPrevStartDate.getTime();

	const jsNewEndDate = new Date(jsEndDate.getTime() + diff);
	const parsedObject = parseISODateTime(jsNewEndDate.toISOString());
	return formatDateTimeInISO(parsedObject);
}

/**
 * A component consisting of two input-date components - one for start of range and one for end of range. Values specified for these components (through start-value and/or end-value attributes) should be localized to the user's timezone if applicable and must be in ISO 8601 calendar date format ("YYYY-MM-DD").
 * @fires change - Dispatched when a start or end date is selected or typed. "start-value" and "end-value" reflect the selected values and are in ISO 8601 calendar date format ("YYYY-MM-DD").
 */
class InputDateRange extends SkeletonMixin(FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement)))) {

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
			 * Label for the end date input
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * Value of the end date input
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
			 * Maximum valid date that could be selected by a user
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date that could be selected by a user
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Indicates that a value is required
			 */
			required: { type: Boolean, reflect: true },
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
		return [super.styles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				display: block;
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

		this.shadowRoot.querySelector('d2l-input-date-time-range-to').setParentNode(this.parentNode);
	}

	render() {
		const startDateInput = this.shadowRoot.querySelector('.d2l-input-date-range-start');
		const endDateInput = this.shadowRoot.querySelector('.d2l-input-date-range-end');
		const tooltipStart = (this.validationError && !this._startCalendarOpened && !this.childErrors.has(startDateInput)) ? html`<d2l-tooltip align="start" announced for="${this._startInputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this._endCalendarOpened && !this.childErrors.has(endDateInput)) ? html`<d2l-tooltip align="start" announced for="${this._endInputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			${tooltipStart}
			${tooltipEnd}
			<d2l-input-fieldset
				label="${ifDefined(this.label)}"
				?label-hidden="${this.labelHidden}"
				?required="${this.required}"
				?skeleton="${this.skeleton}">
				<d2l-input-date-time-range-to
					?display-to="${this.childLabelsHidden}"
					?skeleton="${this.skeleton}"
					?top-margin="${this.label && !this.labelHidden && !this.childLabelsHidden}">
					<d2l-input-date
						?novalidate="${this.noValidate}"
						@change="${this._handleChange}"
						class="d2l-input-date-range-start"
						@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
						?disabled="${this.disabled}"
						.forceInvalid=${this.invalid}
						id="${this._startInputId}"
						label="${this._computedStartLabel}"
						?label-hidden="${this.childLabelsHidden}"
						max-value="${ifDefined(this.maxValue)}"
						min-value="${ifDefined(this.minValue)}"
						?required="${this.required}"
						?skeleton="${this.skeleton}"
						slot="left"
						value="${ifDefined(this.startValue)}">
					</d2l-input-date>
					<d2l-input-date
						?novalidate="${this.noValidate}"
						@change="${this._handleChange}"
						class="d2l-input-date-range-end"
						@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
						?disabled="${this.disabled}"
						.forceInvalid=${this.invalid}
						id="${this._endInputId}"
						label="${this._computedEndLabel}"
						?label-hidden="${this.childLabelsHidden}"
						max-value="${ifDefined(this.maxValue)}"
						min-value="${ifDefined(this.minValue)}"
						?required="${this.required}"
						?skeleton="${this.skeleton}"
						slot="right"
						value="${ifDefined(this.endValue)}">
					</d2l-input-date>
				</d2l-input-date-time-range-to>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'startValue' || prop === 'endValue') {
				if (!this.invalid && this.autoShiftDates && prop === 'startValue' && this.endValue && oldVal) {
					this.endValue = getShiftedEndDate(this.startValue, this.endValue, oldVal, this.inclusiveDateRange);
					this.dispatchEvent(new CustomEvent(
						'change',
						{ bubbles: true, composed: false }
					));
				}

				this.setFormValue({
					[`${this.name}-startValue`]: this.startValue,
					[`${this.name}-endValue`]: this.endValue,
				});
				let badInput = false;
				if (this.startValue && this.endValue) {
					if (this.inclusiveDateRange && (getDateFromISODate(this.endValue) < getDateFromISODate(this.startValue))) {
						badInput = true;
					} else if (!this.inclusiveDateRange && (getDateFromISODate(this.endValue) <= getDateFromISODate(this.startValue))) {
						badInput = true;
					}
				}
				this.setValidity({ badInput: badInput });
				this.requestValidate(true);
			}
		});
	}

	focus() {
		const input = this.shadowRoot.querySelector('d2l-input-date');
		if (input) input.focus();
	}

	async validate() {
		const startDateInput = this.shadowRoot.querySelector('.d2l-input-date-range-start');
		const endDateInput = this.shadowRoot.querySelector('.d2l-input-date-range-end');
		const errors = await Promise.all([startDateInput.validate(), endDateInput.validate(), super.validate()]);
		return [...errors[0], ...errors[1], ...errors[2]];
	}

	get validationMessage() {
		if (this.validity.badInput) {
			return this.localize('components.input-date-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
		}
		return super.validationMessage;
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

}
customElements.define('d2l-input-date-range', InputDateRange);
