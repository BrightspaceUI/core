import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { labelStyles } from './input-label-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputTime extends RtlMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean, reflect: true },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			value: { type: String },
			_formattedValue: { type: String },
			_dateValue: { type: Object }
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
		this._dateValue = parseTime(this.value);
		try {
			this._formattedValue = formatTime(this._dateValue);
		}
		catch (e){
			this._dateValue = new Date();
			this._formattedValue = formatTime(this._dateValue);
		}
		this._setValue();
	}

	render() {
		console.log('render', this._formattedValue);
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

	getHour() {
		return this._dateValue.getHours();
	}

	getMinute() {
		return this._dateValue.getMinutes();
	}

	getSecond() {
		return this._dateValue.getSeconds();
	}

	getTime() {
		return {
			hour: this.getHour(),
			minute: this.getMinute(),
			second: this.getSecond()
		};
	}

	_setValue() {
		this.value = `${this.getHour()}:${this.getMinute()}:${this.getSecond()}`
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

	_handleChange(e) {
		try {
			this._dateValue = parseTime(e.target.value);
			this._formattedValue = formatTime(this._dateValue);
			this._setValue();
			// Change events aren't composed, so we need to re-dispatch
			this.dispatchEvent(new CustomEvent(
				'd2l-time-input-changed',
				{bubbles: true, composed: false} //Taken from input-text component - what do we mean 'composed'? Docs unclear
			));
		}
		catch (e)
		{
			console.log(e);
			this._dateValue = parseTime(this.value);
			this._formattedValue = formatTime(this._dateValue);
		}

		console.log(this._dateValue);
		console.log(this._formattedValue);
		console.log(this.value);
	}
}
customElements.define('d2l-input-time', InputTime);
