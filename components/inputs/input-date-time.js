import './input-date.js';
import './input-fieldset.js';
import './input-time.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getLocalDateFromUTCDateTime, getLocalTimeFromUTCDateTime, getUTCDateTimeFromLocalDateTime } from '../../helpers/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputDateTime extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
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
				padding-right: 0.3rem;
			}
			:host([dir="rtl"]) d2l-input-date {
				padding-right: 0;
				padding-left: 0.3rem;
			}
		`;
	}

	static get resources() {
		return {
			'ar': { date: 'التاريخ', time: 'الوقت' },
			'da': { date: 'Dato', time: 'Tidspunkt' },
			'de': { date: 'Datum', time: 'Uhrzeit' },
			'en': { date: 'Date', time: 'Time' },
			'es': { date: 'Fecha', time: 'Hora' },
			'fr': { date: 'Date', time: 'Heure' },
			'ja': { date: '日付', time: '時間' },
			'ko': { date: '날짜', time: '시간' },
			'nl': { date: 'Datum', time: 'Tijd' },
			'pt': { date: 'Data', time: 'Tempo' },
			'sv': { date: 'Datum', time: 'Tid' },
			'tr': { date: 'Tarih', time: 'Saat' },
			'zh': { date: '日期', time: '时间' },
			'zh-tw': { date: '日期', time: '時間' }
		};
	}

	constructor() {
		super();

		this._parsedDate = '';
		this._parsedTime = '';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time component requires label text');
		}

		if (this.value) {
			try {
				this._parsedDate = getLocalDateFromUTCDateTime(this.value);
				this._parsedTime = getLocalTimeFromUTCDateTime(this.value);
			} catch (e) {
				// set value to empty if invalid initial value
				this.value = '';
			}
		}
	}

	render() {
		const timeHidden = !this._parsedDate;
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}">
				<d2l-input-date
					@change="${this._handleDateChange}"
					?disabled="${this.disabled}"
					label="${this.localize('date')}"
					label-hidden
					.value="${this._parsedDate}">
				</d2l-input-date>
				<d2l-input-time
					@change="${this._handleTimeChange}"
					?disabled="${this.disabled}"
					?hidden="${timeHidden}"
					label="${this.localize('time')}"
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
			const time = this._parsedTime ? this._parsedTime : this.shadowRoot.querySelector('d2l-input-time').value;
			this.value = getUTCDateTimeFromLocalDateTime(this._parsedDate, time);
		}

		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date-time', InputDateTime);
