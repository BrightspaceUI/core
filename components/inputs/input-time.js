import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item-radio.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { getToday, parseISOTime } from '../../helpers/dateTime.js';
import { bodySmallStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';
import { offscreenStyles } from '../offscreen/offscreen-styles.js';

const TODAY = getToday();
const DEFAULT_VALUE = new Date(TODAY.year, TODAY.month, TODAY.date, 0, 0, 0);
let INTERVALS = null;

function getIntervals() {
	if (INTERVALS !== null) {
		return;
	}

	INTERVALS = [];
	for (let i = 0; i < 24; i++) {
		INTERVALS.push(new Date(TODAY.year, TODAY.month, TODAY.date, i, 0, 0));
		INTERVALS.push(new Date(TODAY.year, TODAY.month, TODAY.date, i, 30, 0));
	}
	INTERVALS.push(new Date(TODAY.year, TODAY.month, TODAY.date, 23, 59, 59));
}

function formatValue(time) {
	const zeroPadMin = (time.getMinutes() < 10) ? '0' : '';
	const zeroPadSec = (time.getSeconds() < 10) ? '0' : '';
	const value = `${time.getHours()}:${zeroPadMin}${time.getMinutes()}:${zeroPadSec}${time.getSeconds()}`;
	return value;
}

function parseValue(val) {
	const parsed = parseISOTime(val);
	const time = new Date(TODAY.year, TODAY.month, TODAY.date, parsed.hours, parsed.minutes, parsed.seconds);
	return time;
}

class InputTime extends LitElement {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			value: { type: String },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [ inputStyles, inputLabelStyles, bodySmallStyles, offscreenStyles,
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
		this.labelHidden = false;
		this._value = formatValue(DEFAULT_VALUE);
		this._formattedValue = formatTime(DEFAULT_VALUE);
		this._timezone = formatTime(new Date(), {format: 'ZZZ'});
		this._dropdownId = getUniqueId();
	}

	get value() { return this._value; }
	set value(val) {
		const oldValue = this.value;
		const time = parseValue(val);
		this._value = formatValue(time);
		this._formattedValue = formatTime(time);
		this.requestUpdate('value', oldValue);
	}

	render() {
		getIntervals();
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
							${INTERVALS.map(i => html`
								<d2l-menu-item-radio
									text="${formatTime(i)}"
									value="${formatValue(i)}"
									?selected=${this._value === formatValue(i)}>
								</d2l-menu-item-radio>
							`)}
						</d2l-menu>
						<div class="d2l-input-time-timezone d2l-body-small" slot="footer">${this._timezone}</div>
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</label>
		`;
		return input;
	}

	firstUpdated() {
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
