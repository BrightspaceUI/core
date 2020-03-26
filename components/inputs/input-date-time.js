import './input-date.js';
import './input-fieldset.js';
import './input-time.js';
import { convertLocalToUTCDateTime, convertUTCToLocalDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { parseDateIntoObject, parseISODateTime, parseTimeIntoObject } from '../../helpers/dateTime.js';

function formatDateInISO(year, month, date) {
	if (month < 10) month = `0${month}`;
	if (date < 10) date = `0${date}`;
	return `${year}-${month}-${date}`;
}

function formatTimeInISO(hours, minutes, seconds) {
	if (hours < 10) hours = `0${hours}`;
	if (minutes < 10) minutes = `0${minutes}`;
	if (seconds < 10) seconds = `0${seconds}`;
	return `${hours}:${minutes}:${seconds}`;
}

class InputDateTime extends LitElement {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			value: { type: String },
			_parsedDate: { type: String },
			_parsedTime: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				white-space: nowrap;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				max-width: 10rem;
				padding-right: 0.3rem;
			}
			d2l-input-time {
				max-width: 7rem;
			}
		`;
	}

	constructor() {
		super();

		this._parsedDate = '';
		this._parsedTime = '';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.value) {
			const localDateTime = convertUTCToLocalDateTime(parseISODateTime(this.value));
			this._parsedDate = formatDateInISO(localDateTime.year, localDateTime.month, localDateTime.date);
			this._parsedTime = formatTimeInISO(localDateTime.hours, localDateTime.minutes, localDateTime.seconds);
		}
	}

	render() {
		const timeHidden = !this._parsedDate;
		return html`
			<d2l-input-fieldset label="${this.label}">
				<d2l-input-date
					@d2l-input-date-change="${this._handleDateChange}"
					?disabled="${this.disabled}"
					label="${this.label}"
					label-hidden
					.value="${this._parsedDate}">
				</d2l-input-date>
				<d2l-input-time
					@change="${this._handleTimeChange}"
					?disabled="${this.disabled}"
					?hidden="${timeHidden}"
					label="${this.label}"
					label-hidden
					.value="${this._parsedTime}">
				</d2l-input-time>
			</d2l-input-fieldset>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-fieldset');
		if (elem) elem.focus();
	}

	_handleDateChange(e) {
		this._parsedDate = e.target.value;
		this._updateValueDispatchEvent();
	}

	_handleTimeChange(e) {
		this._parsedTime = e.target.value;
		this._updateValueDispatchEvent();
	}

	_updateValueDispatchEvent() {
		if (!this._parsedDate) {
			this.value = '';
		} else {
			const time = this._parsedTime ? parseTimeIntoObject(this._parsedTime) : this.shadowRoot.querySelector('d2l-input-time').getTime();
			const date = parseDateIntoObject(this._parsedDate);
			const converted = convertLocalToUTCDateTime(Object.assign(date, time));
			const utcDate = formatDateInISO(converted.year, converted.month, converted.date);
			const utcTime = formatTimeInISO(converted.hours, converted.minutes, converted.seconds);
			this.value = `${utcDate}T${utcTime}.000Z`;
		}
		console.log('value ' + this.value)

		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-time-change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date-time', InputDateTime);
