import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item-radio.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { getToday, parseISOTime } from '../../helpers/dateTime.js';
import { bodySmallStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen-styles.js';

const TODAY = getToday();
const END_OF_DAY = new Date(TODAY.year, TODAY.month, TODAY.date, 23, 59, 59);
const INTERVALS = new Map();

function getIntervalNumber(size) {
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

function getDefaultTime(time) {
	switch (time) {
		case 'endOfDay':
			return END_OF_DAY;
		case 'startOfDay':
		case undefined:
			return new Date(TODAY.year, TODAY.month, TODAY.date, 0, 0, 0);
		default:
			return parseValue(time);
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

function parseValue(val) {
	const parsed = parseISOTime(val);
	return new Date(TODAY.year, TODAY.month, TODAY.date, parsed.hours, parsed.minutes, parsed.seconds);
}

class InputTime extends LitElement {

	static get properties() {
		return {
			defaultValue: { type: String, attribute: 'default-value' },
			disabled: { type: Boolean },
			enforceTimeIntervals: { type: Boolean, attribute: 'enforce-time-intervals' },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			maxHeight: { type: Number, attribute: 'max-height' },
			timeInterval: { type: String, attribute: 'time-interval' },
			value: { type: String },
			_formattedValue: { type: String },
			_givenValue: { type: String }
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
					width: auto;
					line-height: 1.8rem;
					text-align: center;
					vertical-align: middle;
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
		if (this.value === undefined) {
			this._givenValue = val;
			return;
		}

		const oldValue = this.value;
		const time = parseValue(val);
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

	render() {
		initIntervals(this.timeInterval);
		const input = html`
			<span class="${this.label && !this.labelHidden ? 'd2l-input-label' : 'd2l-offscreen'}" id="${this._dropdownId}-label">${this.label}</span>
			<d2l-dropdown ?disabled="${this.disabled}">
				<div
					role="combobox"
					aria-owns="${this._dropdownId}"
					class="d2l-dropdown-opener"
					aria-expanded="false">
					<input
						aria-controls="${this._dropdownId}"
						aria-labelledby="${this._dropdownId}-label"
						@change="${this._handleChange}"
						class="d2l-input"
						?disabled="${this.disabled}"
						@keypress="${this._handleKeypress}"
						.value="${this._formattedValue}">
				</div>
				<d2l-dropdown-menu id="dropdown" no-padding-footer max-height="${ifDefined(this.maxHeight)}" min-width="195">
					<d2l-menu
						id="${this._dropdownId}"
						role="listbox"
						class="d2l-input-time-menu"
						aria-labelledby="${this._dropdownId}-label"
						@d2l-menu-item-change="${this._handleDropdownChange}">
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
					<div class="d2l-input-time-timezone d2l-body-small" slot="footer">${this._timezone}</div>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
		return input;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.label === null) {
			console.warn('d2l-input-time component requires label text');
		}

		const time = this._givenValue === undefined || this._givenValue === '' ? getDefaultTime(this.defaultValue) : parseValue(this._givenValue);
		this._value = formatValue(time);
		this._formattedValue = formatTime(time);
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

	getTime() {
		const time = parseValue(this.value);
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
			this._formattedValue = formatTime(parseValue(this.value));
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
}
customElements.define('d2l-input-time', InputTime);
