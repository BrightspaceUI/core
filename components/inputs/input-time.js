import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item-radio.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { bodySmallStyles } from '../typography/styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputLabelStyles } from './input-label-styles.js';
import { inputStyles } from './input-styles.js';

const VALUE_RE = /^([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?$/;
const TODAY = new Date();
const DEFAULT_VALUE = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 0, 0, 0);
const INTERVALS = getIntervals();

function getIntervals() {
	const intervals = [];
	for (let i = 0; i < 24; i++) {
		intervals.push(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), i, 0, 0));
		intervals.push(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), i, 30, 0));
	}
	intervals.push(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 23, 59, 59));
	return intervals;
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
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			value: { type: String },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [ inputStyles, inputLabelStyles, bodySmallStyles,
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
				.d2l-input-time-menu {
					border-top: 1px solid var(--d2l-color-gypsum);
					border-bottom: 1px solid var(--d2l-color-gypsum);
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
		const input = html`
			<d2l-dropdown>
				<div
					role="combobox"
					aria-owns="id1"
					class=" d2l-dropdown-opener">
					<input
						aria-controls="id1"
						aria-activedescendant-id="${ifDefined(this._getSelectedIntervalId())}"
						aria-label="${ifDefined(this._getAriaLabel())}"
						@change="${this._handleChange}"
						class="d2l-input"
						?disabled="${this.disabled}"
						@keypress="${this._handleKeypress}"
						.value="${this._formattedValue}">
				</div>
				<d2l-dropdown-menu id="dropdown" no-padding-footer min-width="195">
					<d2l-menu
						id="id1"
						role="listbox"
						class="d2l-input-time-menu"
						aria-label="${ifDefined(this.label)}"
						@d2l-menu-item-change="${this._handleDropdownChange}">
						${INTERVALS.map(i => html`
							<d2l-menu-item-radio
								id="time-option-${INTERVALS.indexOf(i)}"
								text="${formatTime(i)}"
								value="${formatValue(i)}"
								?selected=${this._value === formatValue(i)}>
							</d2l-menu-item-radio>
						`)}
					</d2l-menu>
					<div class="d2l-input-time-timezone d2l-body-small" slot="footer">${this._timezone}</div>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
		if (this.label && !this.labelHidden) {
			return html`
				<label>
					<span class="d2l-input-label">${this.label}</span>
					${input}
				</label>`;
		}
		return input;
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

	_getSelectedIntervalId() {
		const index = INTERVALS.map(Number).indexOf(+parseTime(this._value));
		if (index >= 0) {
			return `time-option-${index}`;
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
