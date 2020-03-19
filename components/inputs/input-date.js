import '../button/button-subtle.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-content.js';
import '../focus-trap/focus-trap.js';
import '../icons/icon.js';
import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDate, getDateTimeDescriptor, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { getToday } from '../calendar/calendar.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
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

export function formatISODateInUserCalDescriptor(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid value: Expected format is YYYY-MM-DD');
	}

	return formatDate(new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3])));
}

class InputDate extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			placeholder: { type: String },
			value: { type: String },
			_formattedValue: { type: String },
			_trap: { type: Boolean }
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
			d2l-icon[slot="left"] {
				--d2l-icon-height: 0.8rem;
				--d2l-icon-width: 0.8rem;
				margin-left: 0.6rem;
				margin-right: 0.6rem;
			}
			:host([disabled]) d2l-icon {
				opacity: 0.5;
			}
			d2l-focus-trap {
				margin-bottom: -0.7rem;
				margin-top: -0.7rem;
			}
			.d2l-calendar-slot-buttons {
				border-top: 1px solid var(--d2l-color-gypsum);
				display: flex;
				justify-content: flex-end;
				margin-top: 0.3rem;
				padding-top: 0.3rem;
			}
		`;
	}

	static get resources() {
		return {
			'ar': {
				clear: 'مسح',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'da': {
				clear: 'Ryd',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'de': {
				clear: 'Löschen',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'en': {
				ariaLabel: 'Arrow down or press enter to access mini-calendar',
				clear: 'Clear',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'es': {
				clear: 'Borrar',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'fr': {
				clear: 'Effacer',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'ja': {
				clear: 'クリア',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'ko': {
				clear: '지우기',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'nl': {
				clear: 'Wissen',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'pt': {
				clear: 'Desmarcar',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'sv': {
				clear: 'Rensa',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'tr': {
				clear: 'Temizle',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'zh': {
				clear: '清除',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			},
			'zh-tw': {
				clear: '清除',
				chooseDate: 'Choose Date',
				setToToday: 'Set to Today'
			}
		};
	}

	constructor() {
		super();

		this._trap = false;
		this._formattedValue = '';
		this._labelId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');

		const descriptor = getDateTimeDescriptor();
		this.placeholder = descriptor.formats.dateFormats.short;
	}

	render() {
		const ariaLabel = (this.label && this.labelHidden) ? this.label : this.localize('ariaLabel');
		const label = (this.label && !this.labelHidden) ? this.label : undefined;
		const placeholder = this.placeholder || this.localize('chooseDate');

		return html`
			<d2l-dropdown ?disabled="${this.disabled}">
				<d2l-input-text
					aria-label="${ifDefined(ariaLabel)}"
					@change="${this._handleChange}"
					@keydown="${this._handleKeydown}"
					class="d2l-dropdown-opener"
					?disabled="${this.disabled}"
					label="${ifDefined(label)}"
					placeholder="${placeholder}"
					title="${this.localize('ariaLabel')}"
					.value="${this._formattedValue}">
					<d2l-icon
						?disabled="${this.disabled}"
						icon="tier1:calendar"
						slot="left"></d2l-icon>
				</d2l-input-text>
				<d2l-dropdown-content
					boundary="{&quot;above&quot;:0}"
					@d2l-dropdown-close="${this._handleDropdownClose}"
					@d2l-dropdown-open="${this._handleDropdownOpen}"
					min-width="300"
					no-auto-fit>
					<d2l-focus-trap ?trap="${this._trap}">
						<d2l-calendar
							aria-labelledby="${this._labelId}"
							aria-modal="true"
							@d2l-calendar-selected="${this._handleDateSelected}"
							label-id="${this._labelId}"
							selected-value="${ifDefined(this.value)}"
							role="dialog">
						</d2l-calendar>
							<div class="d2l-calendar-slot-buttons">
								<d2l-button-subtle text="${this.localize('setToToday')}" @click="${this._handleSetToToday}"></d2l-button-subtle>
								<d2l-button-subtle text="${this.localize('clear')}" @click="${this._handleClear}"></d2l-button-subtle>
							</div>
					</d2l-focus-trap>
				</d2l-dropdown-content>
			</d2l-dropdown>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-text');
		if (elem) elem.focus();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				if (this.value) this._formattedValue = formatISODateInUserCalDescriptor(this.value);
				else this._formattedValue = '';

			}
		});
	}

	_handleKeydown(e) {
		// open dropdown on keydown
		if (e.keyCode === 40) {
			this._dropdown.open();
		}
	}

	async _handleChange(e) {
		const value = e.target.value;
		this._formattedValue = value;
		await this.updateComplete;
		try {
			const date = parseDate(value);
			this._updateValueDispatchEvent(formatDateInISO(date));
		} catch (e) {
			// leave value the same when invalid input
			this._formattedValue = this.value ? formatISODateInUserCalDescriptor(this.value) : '';
		}
	}

	_handleClear() {
		this._updateValueDispatchEvent('');
		this._dropdown.close();
	}

	_handleDateSelected(e) {
		this._updateValueDispatchEvent(e.detail.date);
		this._dropdown.close();
	}

	_handleDropdownClose() {
		this._trap = false;
	}

	_handleDropdownOpen() {
		this._trap = true;
	}

	_handleSetToToday() {
		const date = getToday();
		this._updateValueDispatchEvent(formatDateInISO(date));
		this._dropdown.close();
	}

	_updateValueDispatchEvent(dateInISO) {
		this.value = dateInISO;
		this.dispatchEvent(new CustomEvent(
			'd2l-input-date-change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date', InputDate);
