import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { labelStyles } from './input-label-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const VALUE_RE = /^([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?$/;
const TODAY = new Date();
const DEFAULT_VALUE = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 0, 0, 0);

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
			second = parseInt(match[3]);
			if (isNaN(second) || second < 0 || second > 59) {
				second = 0;
			}
		}
	}
	const time = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), hour, minute, second);
	return time;
}

class InputTime extends RtlMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean, reflect: true },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			value: { type: String },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return [ inputStyles, labelStyles,
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
			`
		];
	}

	constructor() {
		super();
		this.disabled = false;
		this.labelHidden = false;
		this._value = formatValue(DEFAULT_VALUE);
		this._formattedValue = formatTime(DEFAULT_VALUE);
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
			<input
				aria-label="${ifDefined(this._getAriaLabel())}"
				@change="${this._handleChange}"
				class="d2l-input"
				?disabled="${this.disabled}"
				@keypress="${this._handleKeypress}"
				.value="${this._formattedValue}">
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
		if (this.hasAttribute('aria-label')) {
			return this.getAttribute('aria-label');
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
			// Change events aren't composed, so we need to re-dispatch
			this.dispatchEvent(new CustomEvent(
				'd2l-time-input-changed',
				{bubbles: true, composed: false}
			));
		}
	}

}
customElements.define('d2l-input-time', InputTime);
