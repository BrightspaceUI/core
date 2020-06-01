import './input-date.js';
import './input-fieldset.js';
import './input-time.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getLocalDateTimeFromUTCDateTime, getUTCDateTimeFromLocalDateTime } from '../../helpers/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class InputDateTime extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			minValue: { attribute: 'min-value', reflect: true, type: String },
			value: { type: String },
			_parsedDateTime: { type: String }
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

		this._parsedDateTime = '';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time component requires label text');
		}
	}

	render() {
		const timeHidden = !this._parsedDateTime;
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}">
				<d2l-input-date
					@change="${this._handleDateChange}"
					?disabled="${this.disabled}"
					label="${this.localize('date')}"
					label-hidden
					max-value="${ifDefined(this.maxValue)}"
					min-value="${ifDefined(this.minValue)}"
					.value="${this._parsedDateTime}">
				</d2l-input-date>
				<d2l-input-time
					@change="${this._handleTimeChange}"
					?disabled="${this.disabled}"
					?hidden="${timeHidden}"
					label="${this.localize('time')}"
					label-hidden
					max-height="430"
					.value="${this._parsedDateTime}">
				</d2l-input-time>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				try {
					this._parsedDateTime = getLocalDateTimeFromUTCDateTime(this.value);
				} catch (e) {
					// set value to empty if invalid value
					this.value = '';
					this._parsedDateTime = '';
				}
			}
		});
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-date');
		if (elem) elem.focus();
	}

	_dispatchChangeEvent() {
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleDateChange(e) {
		const newDate = e.target.value;
		if (!newDate) {
			this.value = '';
		} else {
			const time = this.shadowRoot.querySelector('d2l-input-time').value;
			this.value = getUTCDateTimeFromLocalDateTime(newDate, time);
		}
		this._dispatchChangeEvent();
	}

	_handleTimeChange(e) {
		this.value = getUTCDateTimeFromLocalDateTime(this._parsedDateTime, e.target.value);
		this._dispatchChangeEvent();
	}

}
customElements.define('d2l-input-date-time', InputDateTime);
