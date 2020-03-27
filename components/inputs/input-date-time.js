import './input-date.js';
import './input-fieldset.js';
import './input-time.js';
import { convertLocalToUTCDateTime, convertUTCToLocalDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISO, formatTimeInISO, parseISODate, parseISODateTime, parseISOTime } from '../../helpers/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export function formatDateTimeInISO(val) {
	if (!val) {
		throw new Error('Invalid input: Expected input to be an object');
	}
	return `${formatDateInISO({year: val.year, month: val.month, date: val.date})}T${formatTimeInISO({hours: val.hours, minutes: val.minutes, seconds: val.seconds})}.000Z`;
}

class InputDateTime extends RtlMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			required: { type: Boolean },
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
			:host([dir="rtl"]) d2l-input-date {
				padding-right: 0;
				padding-left: 0.3rem;
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
		this.required = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.value) {
			const localDateTime = convertUTCToLocalDateTime(parseISODateTime(this.value));
			this._parsedDate = formatDateInISO({year: localDateTime.year, month: localDateTime.month, date: localDateTime.date});
			this._parsedTime = formatTimeInISO({hours: localDateTime.hours, minutes: localDateTime.minutes, seconds: localDateTime.seconds});
		}
	}

	render() {
		const timeHidden = !this._parsedDate;
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}" ?required="${this.required}">
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
		const elem = this.shadowRoot.querySelector('d2l-input-date');
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
			this._parsedTime = '';
		} else {
			const time = this._parsedTime ? parseISOTime(this._parsedTime) : this.shadowRoot.querySelector('d2l-input-time').getTime();
			const date = parseISODate(this._parsedDate);
			const converted = convertLocalToUTCDateTime(Object.assign(date, time));
			this.value = formatDateTimeInISO(converted);
		}

		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-time-change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date-time', InputDateTime);
