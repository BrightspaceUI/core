import './input-date-time.js';
import './input-fieldset.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getDateFromISODateTime } from '../../helpers/dateTime.js';
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

		this.disabled = false;
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
		if (elem.classList.contains('d2l-input-date-time-range-start')) this.startValue = elem.value;
		else this.endValue = elem.value;
		this.setValidity({ badInput: (this.startValue && this.endValue && (getDateFromISODateTime(this.endValue) <= getDateFromISODateTime(this.startValue))) });
		await this.requestValidate(true);
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
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
