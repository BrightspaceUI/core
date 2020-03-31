import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item-radio.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { bodySmallStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen-styles.js';

const VALUE_RE = /^([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?$/;
const TODAY = new Date();
const END_OF_DAY = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 23, 59, 59);
const DEFAULT_VALUE = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 0, 0, 0);
let INTERVALS = null;

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

function getIntervals(size) {
	if (INTERVALS !== null && INTERVALS[size] !== undefined) {
		return;
	} else if (INTERVALS === null) {
		INTERVALS = [];
	}

	INTERVALS[size] = [];
	const minutes = getIntervalNumber(size);
	const intervalTime = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 0, 0, 0);

	while (intervalTime < END_OF_DAY) {
		INTERVALS[size].push({
			text: formatTime(intervalTime),
			value: formatValue(intervalTime)
		});
		intervalTime.setMinutes(intervalTime.getMinutes() + minutes);
	}
}

function formatValue(time) {
	const zeroPadMin = (time.getMinutes() < 10) ? '0' : '';
	const zeroPadSec = (time.getSeconds() < 10) ? '0' : '';
	const value = `${time.getHours()}:${zeroPadMin}${time.getMinutes()}:${zeroPadSec}${time.getSeconds()}`;
	return value;
}

function parseValue(val) {
	let hour = 0;
	let minute = 0;
	let second = 0;
	const match = VALUE_RE.exec(val);
	if (match !== null) {
		if (match.length > 1) {
			hour = parseInt(match[1]);
			if (isNaN(hour) || hour < 0 || hour > 23) {
				hour = 0;
			}
		}
		if (match.length > 2) {
			minute = parseInt(match[2]);
			if (isNaN(minute) || minute < 0 || minute > 59) {
				minute = 0;
			}
		}
		if (match.length > 3) {
			second = parseInt(match[4]);
			if (isNaN(second) || second < 0 || second > 59) {
				second = 0;
			}
		}
	}
	const time = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), hour, minute, second);
	return time;
}

class InputTime extends LitElement {

	static get properties() {
		return {
			disabled: { type: Boolean },
			enforceTimeIntervals: { type: Boolean, attribute: 'enforce-time-intervals' },
			timeInterval: { type: String, attribute: 'time-interval' },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
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
		this.timeInterval = 'thirty';
		this.labelHidden = false;
		this._dropdownId = getUniqueId();
		this._formattedValue = formatTime(DEFAULT_VALUE);
		this._timezone = formatTime(new Date(), {format: 'ZZZ'});
		this._value = formatValue(DEFAULT_VALUE);
	}

	get value() { return this._value; }
	set value(val) {
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
		getIntervals(this.timeInterval);
		const input = html`
			<label>
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
					<d2l-dropdown-menu id="dropdown" no-padding-footer min-width="195">
						<d2l-menu
							id="${this._dropdownId}"
							role="listbox"
							class="d2l-input-time-menu"
							aria-labelledby="${this._dropdownId}-label"
							@d2l-menu-item-change="${this._handleDropdownChange}">
							${INTERVALS[this.timeInterval].map(i => html`
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
			</label>
		`;
		return input;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.label === null) {
			console.warn('d2l-input-time component requires label text');
		}
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

	getTime() {
		const time = parseValue(this.value);
		return {
			hour: time.getHours(),
			minute: time.getMinutes(),
			second: time.getSeconds()
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
