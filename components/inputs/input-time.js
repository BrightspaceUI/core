import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item-radio.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { getDateFromISOTime, getToday } from '../../helpers/dateTime.js';
import { bodySmallStyles } from '../typography/styles.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';

const TODAY = getToday();
const END_OF_DAY = new Date(TODAY.year, TODAY.month, TODAY.date, 23, 59, 59);
const INTERVALS = new Map();

export function getIntervalNumber(size) {
	switch (size) {
		case 'five':
			return 5;
		case 'ten':
			return 10;
		case 'fifteen':
			return 15;
		case 'twenty':
			return 20;
		case 'sixty':
			return 60;
		case 'thirty':
		default:
			return 30;
	}
}

export function getDefaultTime(time) {
	switch (time) {
		case 'endOfDay':
			return END_OF_DAY;
		case 'startOfDay':
		case undefined:
			return new Date(TODAY.year, TODAY.month, TODAY.date, 0, 0, 0);
		default:
			return getDateFromISOTime(time);
	}
}

function initIntervals(size) {
	if (!INTERVALS.has(size)) {
		const intervalList = [];
		const minutes = getIntervalNumber(size);
		const intervalTime = new Date(TODAY.year, TODAY.month, TODAY.date, 0, 0, 0);

		while (intervalTime < END_OF_DAY) {
			intervalList.push({
				text: formatTime(intervalTime),
				value: formatValue(intervalTime)
			});
			intervalTime.setMinutes(intervalTime.getMinutes() + minutes);
		}

		INTERVALS.set(size, intervalList);
	}

	return INTERVALS.get(size);
}

function formatValue(time) {
	const zeroPadMin = (time.getMinutes() < 10) ? '0' : '';
	const zeroPadSec = (time.getSeconds() < 10) ? '0' : '';
	const value = `${time.getHours()}:${zeroPadMin}${time.getMinutes()}:${zeroPadSec}${time.getSeconds()}`;
	return value;
}

/**
 * A component that consists of a text input field for typing a time and an attached dropdown for time selection. It displays the "value" if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the dropdown or entered in the text input.
 * @fires change - Dispatched when a time is selected or typed. "value" reflects the selected value and is in ISO 8601 time format ("hh:mm:ss").
 */
class InputTime extends FormElementMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Set default value of input. Valid values are times in ISO 8601 time format ("hh:mm:ss"), "startOfDay", "endOfDay".
			 * @type {'startOfDay'|'endOfDay'|string}
			 */
			defaultValue: { type: String, attribute: 'default-value' },
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Rounds up to nearest valid interval time (specified with "time-interval") when user types a time
			 */
			enforceTimeIntervals: { type: Boolean, attribute: 'enforce-time-intervals' },
			/**
			 * REQUIRED: Accessible label for the input
			 */
			label: { type: String },
			/**
			 * Hides the label visually (moves it to the input's "aria-label" attribute)
			 */
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			/**
			 * Override max-height on the time dropdown menu
			 */
			maxHeight: { type: Number, attribute: 'max-height' },
			/**
			 * Number of minutes between times shown in dropdown
			 * @type {'five'|'ten'|'fifteen'|'twenty'|'thirty'|'sixty'}
			 */
			timeInterval: { type: String, attribute: 'time-interval' },
			/**
			 * Value of the input. This should be in ISO 8601 time format ("hh:mm:ss") and should be localized to the user's timezone if applicable.
			 */
			value: { type: String },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [
			bodySmallStyles,
			inputLabelStyles,
			inputStyles,
			offscreenStyles,
			css`
				:host {
					display: inline-block;
					max-width: 6rem;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
				label {
					display: block;
				}
				.d2l-input-time-timezone {
					line-height: 1.8rem;
					text-align: center;
					vertical-align: middle;
					width: auto;
				}
			`
		];
	}

	constructor() {
		super();
		this.disabled = false;
		this.enforceTimeIntervals = false;
		this.labelHidden = false;
		this.timeInterval = 'thirty';
		this._dropdownId = getUniqueId();
		this._timezone = formatTime(new Date(), {format: 'ZZZ'});
	}

	get value() { return this._value; }
	set value(val) {
		// we want value to be midnight in case they dont change it!
		if (this.value === undefined && (val === undefined || val === '')) {
			return;
		}

		const oldValue = this.value;
		const time = val === '' || val === null ? getDefaultTime(this.defaultValue) : getDateFromISOTime(val);

		if (this.enforceTimeIntervals) {
			const interval = getIntervalNumber(this.timeInterval);
			const difference = time.getMinutes() % interval;
			if (difference > 0) {
				time.setMinutes(time.getMinutes() + interval - difference);
			}
		}
		this._value = formatValue(time);
		this._formattedValue = formatTime(time);
		this.requestUpdate('value', oldValue);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.label === null) {
			console.warn('d2l-input-time component requires label text');
		}

		if (this.value === undefined) {
			const time = getDefaultTime(this.defaultValue);
			this._value = formatValue(time);
			this._formattedValue = formatTime(time);
		}
	}

	render() {
		initIntervals(this.timeInterval);
		const input = html`
			<label
				class="${this.label && !this.labelHidden ? 'd2l-input-label' : 'd2l-offscreen'}"
				for="${this._dropdownId}-input"
				id="${this._dropdownId}-label">${this.label}</label>
			<d2l-dropdown ?disabled="${this.disabled}">
				<input
					aria-invalid="${this.invalid ? 'true' : 'false'}"
					aria-controls="${this._dropdownId}"
					aria-describedby="${this._dropdownId}-timezone"
					aria-expanded="false"
					aria-haspopup="true"
					@change="${this._handleChange}"
					class="d2l-input d2l-dropdown-opener"
					?disabled="${this.disabled}"
					id="${this._dropdownId}-input"
					@keydown="${this._handleKeydown}"
					role="combobox"
					.value="${this._formattedValue}">
				<d2l-dropdown-menu
					@d2l-dropdown-close="${this._handleDropdownClose}"
					@d2l-dropdown-open="${this._handleDropdownOpen}"
					no-padding-footer
					max-height="${ifDefined(this.maxHeight)}"
					min-width="195">
					<d2l-menu
						aria-labelledby="${this._dropdownId}-label"
						class="d2l-input-time-menu"
						@d2l-menu-item-change="${this._handleDropdownChange}"
						id="${this._dropdownId}"
						role="listbox">
						${INTERVALS.get(this.timeInterval).map(i => html`
							<d2l-menu-item-radio
								text="${i.text}"
								value="${i.value}"
								?selected=${this._value === i.value}>
							</d2l-menu-item-radio>
						`)}
						${this.enforceTimeIntervals ? '' : html`
								<d2l-menu-item-radio
									text="${formatTime(END_OF_DAY)}"
									value="${formatValue(END_OF_DAY)}"
									?selected=${this._value === formatValue(END_OF_DAY)}>
								</d2l-menu-item-radio>
							`}
					</d2l-menu>
					<div class="d2l-input-time-timezone d2l-body-small" id="${this._dropdownId}-timezone" slot="footer">${this._timezone}</div>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
		return input;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

	getTime() {
		const time = getDateFromISOTime(this.value);
		return {
			hours: time.getHours(),
			minutes: time.getMinutes(),
			seconds: time.getSeconds()
		};
	}

	_getAriaLabel() {
		if (this.label && this.labelHidden) {
			return this.label;
		}
		return undefined;
	}

	async _handleChange(e) {
		const value = e.target.value;
		const time = parseTime(value);
		this._formattedValue = value;
		await this.updateComplete;
		if (time === null) {
			this._formattedValue = formatTime(getDateFromISOTime(this.value));
		} else {
			this.value = formatValue(time);
			this.dispatchEvent(new CustomEvent(
				'change',
				{bubbles: true, composed: false}
			));
		}
	}

	async _handleDropdownChange(e) {
		this.value = e.target.value;
		this.dispatchEvent(new CustomEvent(
			'change',
			{bubbles: true, composed: false}
		));
	}

	_handleDropdownClose() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-time-dropdown-toggle',
			{ bubbles: true, composed: false, detail: { opened: false } }
		));
		this.focus();
	}

	_handleDropdownOpen() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-time-dropdown-toggle',
			{ bubbles: true, composed: false, detail: { opened: true } }
		));
	}

	async _handleKeydown(e) {
		const dropdown = this.shadowRoot.querySelector('d2l-dropdown-menu');
		// open and focus dropdown on down arrow or enter
		if (e.keyCode === 40 || e.keyCode === 13) {
			dropdown.open(true);
			this.shadowRoot.querySelector('d2l-menu').focus();
			e.preventDefault();
		}
	}
}
customElements.define('d2l-input-time', InputTime);
