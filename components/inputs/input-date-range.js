import './input-date.js';
import './input-date-time-range-to.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { formatDateTimeInISO, getDateFromISODate, parseISODateTime } from '../../helpers/dateTime.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
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
 * @slot inline-help - Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
 * @fires change - Dispatched when there is a change to selected start date or selected end date. `start-value` and `end-value` correspond to the selected values and are formatted in ISO 8601 calendar date format (`YYYY-MM-DD`).
 */
class InputDateRange extends FocusMixin(SkeletonMixin(FormElementMixin(RtlMixin(LocalizeCoreElement(LitElement))))) {

	static get properties() {
		return {
			/**
			 * ADVANCED: Automatically shifts end date when start date changes to keep same range
			 * @type {boolean}
			 */
			autoShiftDates: { attribute: 'auto-shift-dates', reflect: true, type: Boolean },
			/**
			 * Hides the start and end labels visually
			 * @type {boolean}
			 */
			childLabelsHidden: { attribute: 'child-labels-hidden', reflect: true, type: Boolean },
			/**
			 * Disables the inputs
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Accessible label for the end date input. Defaults to localized "End Date".
			 * @type {string}
			 * @default "End Date"
			 */
			endLabel: { attribute: 'end-label', reflect: true, type: String },
			/**
			 * ADVANCED: Indicates if the end calendar dropdown is open
			 * @type {boolean}
			 */
			endOpened: { attribute: 'end-opened', type: Boolean },
			/**
			 * Value of the end date input
			 * @type {string}
			 */
			endValue: { attribute: 'end-value', reflect: true, type: String },
			/**
			 * Validates on inclusive range (i.e., it is valid for start and end dates to be equal)
			 * @type {boolean}
			 */
			inclusiveDateRange: { attribute: 'inclusive-date-range', reflect: true, type: Boolean },
			/**
			 * REQUIRED: Accessible label for the input fieldset that wraps the date inputs
			 * @type {string}
			 */
			label: { type: String, reflect: true },
			/**
			 * Hides the fieldset label visually
			 * @type {boolean}
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			/**
			 * Maximum valid date that could be selected by a user
			 * @type {string}
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date that could be selected by a user
			 * @type {string}
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Indicates that values are required
			 * @type {boolean}
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Accessible label for the start date input. Defaults to localized "Start Date".
			 * @type {string}
			 * @default "Start Date"
			 */
			startLabel: { attribute: 'start-label', reflect: true, type: String },
			/**
			 * ADVANCED: Indicates if the start calendar dropdown is open
			 * @type {boolean}
			 */
			startOpened: { attribute: 'start-opened', type: Boolean },
			/**
			 * Value of the start date input
			 * @type {string}
			 */
			startValue: { attribute: 'start-value', reflect: true, type: String }
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
		this.endOpened = false;
		this.inclusiveDateRange = false;
		this.labelHidden = false;
		this.required = false;
		this.startOpened = false;

		this._startInputId = getUniqueId();
		this._endInputId = getUniqueId();
	}

	static get focusElementSelector() {
		return 'd2l-input-date';
	}

	/** @ignore */
	get validationMessage() {
		if (this.validity.badInput) {
			return this.localize('components.input-date-range.errorBadInput', { startLabel: this._computedStartLabel, endLabel: this._computedEndLabel });
		}
		return super.validationMessage;
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-range component requires label text');
		}
		this.shadowRoot.querySelector('d2l-input-date-time-range-to').setParentNode(this);
	}

	render() {
		const startDateInput = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input-date-range-start');
		const endDateInput = this.shadowRoot && this.shadowRoot.querySelector('.d2l-input-date-range-end');
		const tooltipStart = (this.validationError && !this.startOpened && !this.childErrors.has(startDateInput)) ? html`<d2l-tooltip align="start" announced for="${this._startInputId}" state="error" class="vdiff-target">${this.validationError}</d2l-tooltip>` : null;
		const tooltipEnd = (this.validationError && !this.endOpened && !this.childErrors.has(endDateInput)) ? html`<d2l-tooltip align="start" announced for="${this._endInputId}" state="error" class="vdiff-target">${this.validationError}</d2l-tooltip>` : null;
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
						class="d2l-input-date-range-start vdiff-target"
						@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
						?disabled="${this.disabled}"
						.forceInvalid=${this.invalid}
						id="${this._startInputId}"
						label="${this._computedStartLabel}"
						?label-hidden="${this.childLabelsHidden}"
						max-value="${ifDefined(this.maxValue)}"
						min-value="${ifDefined(this.minValue)}"
						?opened="${this.startOpened}"
						?required="${this.required}"
						?skeleton="${this.skeleton}"
						slot="left"
						value="${ifDefined(this.startValue)}">
					</d2l-input-date>
					<d2l-input-date
						?novalidate="${this.noValidate}"
						@change="${this._handleChange}"
						class="d2l-input-date-range-end vdiff-target"
						@d2l-input-date-dropdown-toggle="${this._handleDropdownToggle}"
						?disabled="${this.disabled}"
						.forceInvalid=${this.invalid}
						id="${this._endInputId}"
						label="${this._computedEndLabel}"
						?label-hidden="${this.childLabelsHidden}"
						max-value="${ifDefined(this.maxValue)}"
						min-value="${ifDefined(this.minValue)}"
						?opened="${this.endOpened}"
						?required="${this.required}"
						?skeleton="${this.skeleton}"
						slot="right"
						value="${ifDefined(this.endValue)}">
					</d2l-input-date>
				</d2l-input-date-time-range-to>
				<slot slot="inline-help" name="inline-help"></slot>
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

	async validate() {
		if (!this.shadowRoot) return;
		const startDateInput = this.shadowRoot.querySelector('.d2l-input-date-range-start');
		const endDateInput = this.shadowRoot.querySelector('.d2l-input-date-range-end');
		const errors = await Promise.all([startDateInput.validate(), endDateInput.validate(), super.validate()]);
		return [...errors[0], ...errors[1], ...errors[2]];
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
			this.startOpened = e.detail.opened;
		} else {
			this.endOpened = e.detail.opened;
		}
	}

}
customElements.define('d2l-input-date-range', InputDateRange);
