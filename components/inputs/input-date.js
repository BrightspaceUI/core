import '../icons/icon.js';
import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDate, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export function formatDateInISO(val) {
	let month = parseInt(val.getMonth()) + 1;
	let date = val.getDate();
	if (month < 10) month = `0${month}`;
	if (date < 10) date = `0${date}`;
	return `${val.getFullYear()}-${month}-${date}`;
}

export function parseISODate(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid value: Expected format is YYYY-MM-DD');
	}

	return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
}

class InputDate extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			placeholder: { type: String },
			value: { type: String },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				min-width: 7rem;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-icon {
				--d2l-icon-height: 0.8rem;
				--d2l-icon-width: 0.8rem;
				margin-left: 0.6rem;
				margin-right: 0.6rem;
			}
			:host([disabled]) d2l-icon {
				opacity: 0.5;
			}
		`;
	}

	static get resources() {
		return {
			'ar': { chooseDate: 'Choose Date' },
			'da': { chooseDate: 'Choose Date' },
			'de': { chooseDate: 'Choose Date' },
			'en': { chooseDate: 'Choose Date' },
			'es': { chooseDate: 'Choose Date' },
			'fr': { chooseDate: 'Choose Date' },
			'ja': { chooseDate: 'Choose Date' },
			'ko': { chooseDate: 'Choose Date' },
			'nl': { chooseDate: 'Choose Date' },
			'pt': { chooseDate: 'Choose Date' },
			'sv': { chooseDate: 'Choose Date' },
			'tr': { chooseDate: 'Choose Date' },
			'zh': { chooseDate: 'Choose Date' },
			'zh-tw': { chooseDate: 'Choose Date' }
		};
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._formattedValue = this.value ? formatDate(parseISODate(this.value)) : '';
	}

	render() {
		const ariaLabel = (this.label && this.labelHidden) ? this.label : undefined;
		const label = (this.label && !this.labelHidden) ? this.label : undefined;
		const placeholder = this.placeholder || this.localize('chooseDate');

		return html`
			<d2l-input-text
				aria-label="${ifDefined(ariaLabel)}"
				@change="${this._handleChange}"
				?disabled="${this.disabled}"
				label="${ifDefined(label)}"
				placeholder="${placeholder}"
				.value="${this._formattedValue}">
				<d2l-icon
					?disabled="${this.disabled}"
					icon="tier1:calendar"
					slot="left"></d2l-icon>
			</d2l-input-text>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-text');
		if (elem) elem.focus();
	}

	async _handleChange(e) {
		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;
		try {
			const date = parseDate(value);
			this.value = formatDateInISO(date);
			this.dispatchEvent(new CustomEvent(
				'd2l-input-date-change',
				{ bubbles: true, composed: false }
			));
		} catch (e) {
			// leave value the same when invalid input
		}
		this._formattedValue = this.value ? formatDate(parseISODate(this.value)) : '';
	}

}
customElements.define('d2l-input-date', InputDate);
