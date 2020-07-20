import '../button/button-subtle.js';
import '../calendar/calendar.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-content.js';
import '../focus-trap/focus-trap.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDate, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { formatDateInISO, getDateFromISODate, getDateTimeDescriptorShared, getToday } from '../../helpers/dateTime.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export function formatISODateInUserCalDescriptor(val) {
	return formatDate(getDateFromISODate(val));
}

/**
 * A component that consists of a text input field for typing a date and an attached calendar (d2l-calendar) dropdown. It displays the "value" if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the calendar or entered in the text input.
 * @fires change - Dispatched when a date is selected or typed. "value" reflects the selected value and is in ISO 8601 calendar date format ("YYYY-MM-DD").
 */
class InputDate extends FormElementMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Text to reassure users that they can choose not to provide a value in this field (usually not necessary)
			 */
			emptyText: { type: String, attribute: 'empty-text'},
			/**
			 * REQUIRED: Accessible label for the input
			 */
			label: { type: String },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Maximum valid date that could be selected by a user.
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			/**
			 * Minimum valid date that could be selected by a user.
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },
			/**
			 * Value of the input
			 */
			value: { type: String },
			_hiddenContentWidth: { type: String },
			_dateTimeDescriptor: { type: Object },
			_dropdownOpened: { type: Boolean },
			_formattedValue: { type: String },
			_shownValue: { type: String }
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
			d2l-dropdown {
				width: 100%;
			}
			d2l-icon {
				--d2l-icon-height: 0.8rem;
				--d2l-icon-width: 0.8rem;
				margin-left: 0.6rem;
				margin-right: 0.6rem;
			}
			:host([disabled]) d2l-icon {
				opacity: 0.5;
			}
			.d2l-input-date-hidden-content {
				font-family: inherit;
				font-size: 0.8rem;
				font-weight: 400;
				letter-spacing: 0.02rem;
				line-height: 1.4rem;
				position: absolute;
				visibility: hidden;
				width: auto;
			}
			d2l-focus-trap {
				padding: 0.25rem 0.6rem;
			}
			.d2l-calendar-slot-buttons {
				border-top: 1px solid var(--d2l-color-gypsum);
				display: flex;
				justify-content: flex-end;
				margin-top: 0.3rem;
				padding-top: 0.3rem;
			}
		`;
	}

	constructor() {
		super();

		this.disabled = false;
		this.emptyText = '';
		this.labelHidden = false;
		this.value = '';

		this._dropdownOpened = false;
		this._formattedValue = '';
		this._hiddenContentWidth = '8rem';
		this._inputId = getUniqueId();
		this._namespace = 'components.input-date';
		this._shownValue = '';

		this._dateTimeDescriptor = getDateTimeDescriptorShared();
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date component requires label text');
		}

		this._calendar = this.shadowRoot.querySelector('d2l-calendar');
		this._dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');
		this._textInput = this.shadowRoot.querySelector('d2l-input-text');

		this.addEventListener('blur', this._handleBlur);
		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			this._dateTimeDescriptor = getDateTimeDescriptorShared(true);
			this.requestUpdate().then(() => {
				const width = Math.ceil(parseFloat(getComputedStyle(this.shadowRoot.querySelector('.d2l-input-date-hidden-content')).getPropertyValue('width')));
				this._hiddenContentWidth = `${width}px`;
			});
		});

		this._formattedValue = this.emptyText ? this.emptyText : '';

		await (document.fonts ? document.fonts.ready : Promise.resolve());
		const width = Math.ceil(parseFloat(getComputedStyle(this.shadowRoot.querySelector('.d2l-input-date-hidden-content')).getPropertyValue('width')));
		this._hiddenContentWidth = `${width}px`;
	}

	render() {
		const formattedWideDate = formatISODateInUserCalDescriptor('2323-12-23');
		const inputTextWidth = `calc(${this._hiddenContentWidth} + 0.75rem + 3px)`; // text and icon width + paddingRight + border width + 1
		const shortDateFormat = (this._dateTimeDescriptor.formats.dateFormats.short).toUpperCase();
		this.style.maxWidth = inputTextWidth;

		const tooltip = this.validationError ? html`<d2l-tooltip align="start" for="${this._inputId}" state="error">${this.validationError}</d2l-tooltip>` : null;
		return html`
			<d2l-validation-custom for="${this._inputId}" @d2l-validation-custom-validate=${this._validate} failure-text="Pick in range"></d2l-validation-custom>
			<div aria-hidden="true" class="d2l-input-date-hidden-content">
				<div><d2l-icon icon="tier1:calendar"></d2l-icon>${formattedWideDate}</div>
				<div><d2l-icon icon="tier1:calendar"></d2l-icon>${shortDateFormat}</div>
				<div><d2l-icon icon="tier1:calendar"></d2l-icon>${this.emptyText}</div>
			</div>
			${tooltip}
			<d2l-dropdown ?disabled="${this.disabled}" no-auto-open>
				<d2l-input-text
					aria-invalid="${this.invalid ? 'true' : 'false'}"
					atomic="true"
					@change="${this._handleChange}"
					class="d2l-dropdown-opener"
					?disabled="${this.disabled}"
					@focus="${this._handleInputTextFocus}"
					@keydown="${this._handleKeydown}"
					hide-invalid-icon
					id="${this._inputId}"
					label="${ifDefined(this.label)}"
					?label-hidden="${this.labelHidden}"
					live="assertive"
					@mouseup="${this._handleMouseup}"
					placeholder="${shortDateFormat}"
					style="${styleMap({maxWidth: inputTextWidth})}"
					title="${this.localize(`${this._namespace}.openInstructions`, {format: shortDateFormat})}"
					.value="${this._formattedValue}">
					<d2l-icon
						icon="${this.invalid ? 'tier1:alert' : 'tier1:calendar'}"
						slot="left"
						style="${styleMap({color: this.invalid ? 'var(--d2l-color-cinnabar)' : ''})}"></d2l-icon>
				</d2l-input-text>
				<d2l-dropdown-content
					@d2l-dropdown-close="${this._handleDropdownClose}"
					@d2l-dropdown-open="${this._handleDropdownOpen}"
					max-width="335"
					no-auto-fit
					no-auto-focus
					no-padding>
					<d2l-focus-trap @d2l-focus-trap-enter="${this._handleFocusTrapEnter}" ?trap="${this._dropdownOpened}">
						<d2l-calendar
							@d2l-calendar-selected="${this._handleDateSelected}"
							max-value="${ifDefined(this.maxValue)}"
							min-value="${ifDefined(this.minValue)}"
							selected-value="${ifDefined(this._shownValue)}">
							<div class="d2l-calendar-slot-buttons">
								<d2l-button-subtle text="${this.localize(`${this._namespace}.setToToday`)}" @click="${this._handleSetToToday}"></d2l-button-subtle>
								<d2l-button-subtle text="${this.localize(`${this._namespace}.clear`)}" @click="${this._handleClear}"></d2l-button-subtle>
							</div>
						</d2l-calendar>
					</d2l-focus-trap>
				</d2l-dropdown-content>
			</d2l-dropdown>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_dateTimeDescriptor' || prop === 'value') {
				this._shownValue = this.value;
				this._setFormattedValue();
			}
		});
	}

	focus() {
		if (this._textInput) this._textInput.focus();
	}

	get validationMessageRangeOverflow() {
		let failureText = '';
		if (this.minValue && this.maxValue) {
			failureText = this.localize(
				`${this._namespace}.errorOutsideRange`, {
					minDate: formatDate(getDateFromISODate(this.minValue), {format: 'medium'}),
					maxDate: formatDate(getDateFromISODate(this.maxValue), {format: 'medium'})
				}
			);
		} else if (this.maxValue) {
			failureText = this.localize(
				`${this._namespace}.errorMaxDateOnly`, {
					maxDate: formatDate(getDateFromISODate(this.maxValue), {format: 'medium'})
				}
			);
		}
		return failureText;
	}

	get validationMessageRangeUnderflow() {
		let failureText = '';
		if (this.minValue && this.maxValue) {
			failureText = this.localize(
				`${this._namespace}.errorOutsideRange`, {
					minDate: formatDate(getDateFromISODate(this.minValue), {format: 'medium'}),
					maxDate: formatDate(getDateFromISODate(this.maxValue), {format: 'medium'})
				}
			);
		} else if (this.minValue) {
			failureText = this.localize(
				`${this._namespace}.errorMinDateOnly`, {
					minDate: formatDate(getDateFromISODate(this.minValue), {format: 'medium'})
				}
			);
		}
		return failureText;
	}

	_handleBlur() {
		this._setFormattedValue(); // needed for case with empty text click on input-text then blur
	}

	async _handleChange() {
		const value = this._textInput.value;
		if (!value) {
			if (value !== this.value) {
				await this._updateValueDispatchEvent('');
				await this.updateComplete;
				await this._calendar.reset();
			}
			return;
		}
		this._formattedValue = value;
		await this.updateComplete;
		try {
			const date = parseDate(value);
			await this._updateValueDispatchEvent(formatDateInISO({year: date.getFullYear(), month: (parseInt(date.getMonth()) + 1), date: date.getDate()}));
		} catch (err) {
			// leave value the same when invalid input
		}
		this._setFormattedValue(); // keep out here in case parseDate is same date, e.g., user adds invalid text to end of parseable date
		await this.updateComplete;
		await this._calendar.reset(true);
	}

	async _handleClear() {
		await this._updateValueDispatchEvent('');
		this._dropdown.close();
		this.focus();
	}

	async _handleDateSelected(e) {
		const value = e.target.selectedValue;
		await this._updateValueDispatchEvent(value);
		this._dropdown.close();
	}

	_handleDropdownClose() {
		this._calendar.reset();
		this._dropdownOpened = false;
		this._textInput.scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
	}

	_handleDropdownOpen() {
		if (!this._dropdown.openedAbove) this.shadowRoot.querySelector('d2l-focus-trap').scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
		// use setTimeout to wait for keyboard to open on mobile devices
		const tooltip = this.shadowRoot.querySelector('d2l-tooltip');
		if (tooltip && tooltip.showing) tooltip.hide();
		setTimeout(() => {
			this._textInput.scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
		}, 150);
		this._dropdownOpened = true;
		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-dropdown-open',
			{ bubbles: true, composed: false }
		));
	}

	async _handleFocusTrapEnter() {
		this._calendar.focus();
	}

	_handleInputTextFocus() {
		this._formattedValue = this._shownValue ? formatISODateInUserCalDescriptor(this._shownValue) : '';
		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-text-focus',
			{ bubbles: true, composed: false }
		));
	}

	async _handleKeydown(e) {
		// open dropdown on down arrow or enter and focus on calendar focus date
		if (e.keyCode === 40 || e.keyCode === 13) {
			this._dropdown.open();
			await this._handleChange();
			this._calendar.focus();
			this._setFormattedValue();
			e.preventDefault();
		}
	}

	_handleMouseup() {
		if (!this.disabled) {
			if (!this._dropdownOpened) this._handleChange();
			this._dropdown.toggleOpen(false);
		}
	}

	async _handleSetToToday() {
		const date = getToday();
		await this._updateValueDispatchEvent(formatDateInISO(date));
		this._dropdown.close();
		this.focus();
	}

	_setFormattedValue() {
		this._formattedValue = this._shownValue ? formatISODateInUserCalDescriptor(this._shownValue) : (this.emptyText ? this.emptyText : '');
	}

	async _updateValueDispatchEvent(dateInISO) {
		if (dateInISO === this._shownValue) return; // prevent validation from happening multiple times for same change
		this._shownValue = dateInISO;
		this.setValidity({
			rangeUnderflow: dateInISO && this.minValue && getDateFromISODate(dateInISO).getTime() < getDateFromISODate(this.minValue).getTime(),
			rangeOverflow: dateInISO && this.maxValue && getDateFromISODate(dateInISO).getTime() > getDateFromISODate(this.maxValue).getTime()
		});
		await this.requestValidate();
		this.value = dateInISO;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date', InputDate);
