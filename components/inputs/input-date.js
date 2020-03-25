import '../button/button-subtle.js';
import '../calendar/calendar.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-content.js';
import '../focus-trap/focus-trap.js';
import '../icons/icon.js';
import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDate, getDateTimeDescriptor, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { formatDateInISO, getToday, parseISODate } from '../../helpers/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

let calendarDataDescriptor;
function getCalendarDescriptor() {
	if (!calendarDataDescriptor) {
		calendarDataDescriptor = getDateTimeDescriptor();
	}
	return calendarDataDescriptor;
}

export function formatISODateInUserCalDescriptor(val) {
	return formatDate(parseISODate(val));
}

class InputDate extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			placeholder: { type: String },
			value: { type: String },
			_dropdownOpened: { type: Boolean },
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
			d2l-focus-trap {
				padding: 0.6rem;
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
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today',
			},
			'da': {
				clear: 'Ryd',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today',
			},
			'de': {
				clear: 'Löschen',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'en': {
				clear: 'Clear',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'es': {
				clear: 'Borrar',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'fr': {
				clear: 'Effacer',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'ja': {
				clear: 'クリア',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'ko': {
				clear: '지우기',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'nl': {
				clear: 'Wissen',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'pt': {
				clear: 'Desmarcar',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'sv': {
				clear: 'Rensa',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'tr': {
				clear: 'Temizle',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'zh': {
				clear: '清除',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			},
			'zh-tw': {
				clear: '清除',
				openInstructions: 'Arrow down or press enter to access mini-calendar',
				setToToday: 'Set to Today'
			}
		};
	}

	constructor() {
		super();

		this._dropdownOpened = false;
		this._formattedValue = '';

		getCalendarDescriptor();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');
	}

	render() {
		const placeholder = this.placeholder || calendarDataDescriptor.formats.dateFormats.short;

		return html`
			<d2l-dropdown ?disabled="${this.disabled}">
				<d2l-input-text
					@change="${this._handleChange}"
					class="d2l-dropdown-opener"
					?disabled="${this.disabled}"
					@keydown="${this._handleKeydown}"
					label="${ifDefined(this.label)}"
					?label-hidden="${this.labelHidden}"
					placeholder="${placeholder}"
					title="${this.localize('openInstructions')}"
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
					no-auto-fit
					no-auto-focus
					no-padding>
					<d2l-focus-trap @d2l-focus-trap-enter="${this._handleFocusTrapEnter}" ?trap="${this._dropdownOpened}">
						<d2l-calendar
							@d2l-calendar-selected="${this._handleDateSelected}"
							selected-value="${ifDefined(this.value)}">
							<div class="d2l-calendar-slot-buttons">
								<d2l-button-subtle text="${this.localize('setToToday')}" @click="${this._handleSetToToday}"></d2l-button-subtle>
								<d2l-button-subtle text="${this.localize('clear')}" @click="${this._handleClear}"></d2l-button-subtle>
							</div>
						</d2l-calendar>
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
				this._formattedValue = this.value ? formatISODateInUserCalDescriptor(this.value) : '';

			}
		});
	}

	async _handleFocusTrapEnter() {
		this.shadowRoot.querySelector('d2l-calendar').focus();
	}

	_handleKeydown(e) {
		// open dropdown on down arrow or enter and focus on calendar focus date
		if (e.keyCode === 40 || e.keyCode === 13) {
			this._dropdown.open();
			this.shadowRoot.querySelector('d2l-calendar').focus();
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
		const value = e.target.selectedValue;
		this._updateValueDispatchEvent(value);
		this._dropdown.close();
	}

	_handleDropdownClose() {
		this._dropdownOpened = false;
	}

	_handleDropdownOpen() {
		this._dropdownOpened = true;
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
