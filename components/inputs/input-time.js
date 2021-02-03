import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item-radio.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISOTime, getDateFromISOTime } from '../../helpers/dateTime.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { bodySmallStyles } from '../typography/styles.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const START_OF_DAY = new Date(2020, 0, 1, 0, 1, 0);
const END_OF_DAY = new Date(2020, 0, 1, 23, 59, 59);
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

export function getDefaultTime(time, enforceTimeIntervals) {
	switch (time) {
		case 'endOfDay':
			return END_OF_DAY;
		case 'startOfDay':
		case undefined:
			return enforceTimeIntervals ? new Date(2020, 0, 1, 0, 0, 0) : START_OF_DAY;
		default:
			return getDateFromISOTime(time);
	}
}

export function getFormattedDefaultTime(defaultValue, enforceTimeIntervals) {
	const time = getDefaultTime(defaultValue, enforceTimeIntervals);
	return formatDateInISOTime(time);
}

export function getTimeAtInterval(timeInterval, time) {
	const interval = getIntervalNumber(timeInterval);
	const difference = time.getMinutes() % interval;
	if (difference > 0) {
		time.setMinutes(time.getMinutes() + interval - difference);
	}
	return time;
}

function initIntervals(size, enforceTimeIntervals) {
	const mapKey = `${size}-${enforceTimeIntervals}`;
	if (!INTERVALS.has(mapKey)) {
		const intervalList = [];
		const intervalNumber = getIntervalNumber(size);

		let val = enforceTimeIntervals ? 0 : intervalNumber;
		if (!enforceTimeIntervals) {
			intervalList.push({
				text: formatTime(START_OF_DAY),
				value: formatDateInISOTime(START_OF_DAY)
			});
		}
		while (val < 1440) {
			const hours = Math.floor(val / 60);
			const minutes = val - (hours * 60);
			const intervalTime = new Date(2020, 0, 1, hours, minutes, 0);
			intervalList.push({
				text: formatTime(intervalTime),
				value: formatDateInISOTime(intervalTime)
			});
			val += intervalNumber;
		}
		if (!enforceTimeIntervals) {
			intervalList.push({
				text: formatTime(END_OF_DAY),
				value: formatDateInISOTime(END_OF_DAY)
			});
		}

		INTERVALS.set(mapKey, intervalList);
	}

	return INTERVALS.get(mapKey);
}

/**
 * A component that consists of a text input field for typing a time and an attached dropdown for time selection. It displays the "value" if one is specified, or a placeholder if not, and reflects the selected value when one is selected in the dropdown or entered in the text input.
 * @fires change - Dispatched when a time is selected or typed. "value" reflects the selected value and is in ISO 8601 time format ("hh:mm:ss").
 */
class InputTime extends SkeletonMixin(FormElementMixin(LitElement)) {

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
			 * Indicates that a value is required
			 */
			required: { type: Boolean, reflect: true },
			/**
			 * Number of minutes between times shown in dropdown
			 * @type {'five'|'ten'|'fifteen'|'twenty'|'thirty'|'sixty'}
			 */
			timeInterval: { type: String, attribute: 'time-interval' },
			/**
			 * Value of the input. This should be in ISO 8601 time format ("hh:mm:ss") and should be localized to the user's timezone if applicable.
			 */
			value: { type: String },
			_dropdownFirstOpened: { type: Boolean },
			_formattedValue: { type: String },
			_hiddenContentWidth: { type: String }
		};
	}

	static get styles() {
		return [
			super.styles,
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
				.d2l-input-label {
					display: inline-block;
					vertical-align: top;
				}
				.d2l-input-time-timezone {
					line-height: 1.8rem;
					text-align: center;
					vertical-align: middle;
					width: auto;
				}
				.d2l-input-time-hidden-content {
					font-family: inherit;
					font-size: 0.8rem;
					font-weight: 400;
					letter-spacing: 0.02rem;
					line-height: 1.4rem;
					position: absolute;
					visibility: hidden;
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
		this.required = false;
		this.timeInterval = 'thirty';
		this._dropdownFirstOpened = false;
		this._dropdownId = getUniqueId();
		this._hiddenContentWidth = '6rem';
		this._timezone = formatTime(new Date(), { format: 'ZZZ' });
	}

	get value() { return this._value; }
	set value(val) {
		// we want value to be midnight in case they dont change it!
		if (this.value === undefined && (val === undefined || val === '')) {
			return;
		}

		const oldValue = this.value;
		let time = val === '' || val === null ? getDefaultTime(this.defaultValue, this.enforceTimeIntervals) : getDateFromISOTime(val);

		if (this.enforceTimeIntervals) {
			time = getTimeAtInterval(this.timeInterval, time);
		}
		this._value = formatDateInISOTime(time);
		this._formattedValue = formatTime(time);
		this.requestUpdate('value', oldValue);
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.label) {
			console.warn('d2l-input-time component requires label text');
		}

		if (this.value === undefined) {
			const time = getDefaultTime(this.defaultValue, this.enforceTimeIntervals);
			this._value = formatDateInISOTime(time);
			this._formattedValue = formatTime(time);
		}

		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			this._formattedValue = formatTime(getDateFromISOTime(this.value));
			INTERVALS.clear();
		});

		await (document.fonts ? document.fonts.ready : Promise.resolve());

		const hiddenContent = this.shadowRoot.querySelector('.d2l-input-time-hidden-content');
		this._hiddenContentResizeObserver = new ResizeObserver(() => {
			const width = Math.ceil(parseFloat(getComputedStyle(hiddenContent).getPropertyValue('width')));
			this._hiddenContentWidth = `${width}px`;

			this.dispatchEvent(new CustomEvent(
				'd2l-input-time-hidden-content-width-change',
				{ bubbles: true, composed: false }
			));
		});
		this._hiddenContentResizeObserver.observe(hiddenContent);

	}

	render() {
		if (this._dropdownFirstOpened) initIntervals(this.timeInterval, this.enforceTimeIntervals);
		const ariaRequired = this.required ? 'true' : undefined;
		const disabled = this.disabled || this.skeleton;
		const menuItems = this._dropdownFirstOpened ? html`
			${INTERVALS.get(`${this.timeInterval}-${this.enforceTimeIntervals}`).map(i => html`
				<d2l-menu-item-radio
					text="${i.text}"
					value="${i.value}"
					?selected=${this._value === i.value}>
				</d2l-menu-item-radio>
			`)}` : null;
		const formattedWideTimeAM = formatTime(new Date(2020, 0, 1, 10, 23, 0));
		const formattedWideTimePM = formatTime(new Date(2020, 0, 1, 23, 23, 0));
		const inputTextWidth = `calc(${this._hiddenContentWidth} + 1.5rem + 3px)`; // text and icon width + left & right padding + border width + 1
		this.style.maxWidth = inputTextWidth;

		return html`
			<div aria-hidden="true" class="d2l-input-time-hidden-content">
				<div>${formattedWideTimeAM}</div>
				<div>${formattedWideTimePM}</div>
			</div>
			<label
				class="${this.label && !this.labelHidden ? 'd2l-input-label d2l-skeletize' : 'd2l-offscreen'}"
				for="${this._dropdownId}-input"
				id="${this._dropdownId}-label">${this.label}</label>
			<d2l-dropdown class="d2l-skeletize" ?disabled="${disabled}">
				<input
					aria-invalid="${this.invalid ? 'true' : 'false'}"
					aria-controls="${this._dropdownId}"
					aria-describedby="${this._dropdownId}-timezone"
					aria-expanded="false"
					aria-haspopup="true"
					aria-required="${ifDefined(ariaRequired)}"
					@change="${this._handleChange}"
					class="d2l-input d2l-dropdown-opener"
					?disabled="${disabled}"
					id="${this._dropdownId}-input"
					@keydown="${this._handleKeydown}"
					?required="${this.required}"
					role="combobox"
					type="text"
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
						${menuItems}
					</d2l-menu>
					<div class="d2l-input-time-timezone d2l-body-small" id="${this._dropdownId}-timezone" slot="footer">${this._timezone}</div>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') this.setFormValue(this.value);
		});
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
			this.value = formatDateInISOTime(time);
			this.dispatchEvent(new CustomEvent(
				'change',
				{ bubbles: true, composed: false }
			));
		}
	}

	async _handleDropdownChange(e) {
		this.value = e.target.value;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleDropdownClose() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-time-dropdown-toggle',
			{ bubbles: true, composed: false, detail: { opened: false } }
		));
		this.focus();
	}

	async _handleDropdownOpen() {
		if (!this._dropdownFirstOpened) this._dropdownFirstOpened = true;
		this.dispatchEvent(new CustomEvent(
			'd2l-input-time-dropdown-toggle',
			{ bubbles: true, composed: false, detail: { opened: true } }
		));
	}

	async _handleKeydown(e) {
		const dropdown = this.shadowRoot.querySelector('d2l-dropdown-menu');
		// open and focus dropdown on down arrow or enter
		if (e.keyCode === 40 || e.keyCode === 13) {
			if (!this._dropdownFirstOpened) {
				this._dropdownFirstOpened = true;
				await this.updateComplete;
			}
			dropdown.open(true);
			this.shadowRoot.querySelector('d2l-menu').focus();
			e.preventDefault();
		}
	}
}
customElements.define('d2l-input-time', InputTime);
