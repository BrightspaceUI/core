import '../button/button-subtle.js';
import '../calendar/calendar.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-content.js';
import '../focus-trap/focus-trap.js';
import '../icons/icon.js';
import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDate, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { formatDateInISO, getDateFromISODate, getDateTimeDescriptorShared, getToday } from '../../helpers/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

export function formatISODateInUserCalDescriptor(val) {
	return formatDate(getDateFromISODate(val));
}

class InputDate extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			emptyStateText: { type: String, attribute: 'empty-state-text'},
			value: { type: String },
			_dropdownOpened: { type: Boolean },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				max-width: 9rem;
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
				padding: 0.25rem 0.6rem;
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

		this.emptyStateText = '';
		this.value = '';

		this._dropdownOpened = false;
		this._formattedValue = '';

		this._dateTimeDescriptor = getDateTimeDescriptorShared();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date component requires label text');
		}

		this._dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');
		this._calendar = this.shadowRoot.querySelector('d2l-calendar');

		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			this._dateTimeDescriptor = getDateTimeDescriptorShared(true);
			this.requestUpdate();
		});

		this._formattedValue = this.emptyStateText ? this.emptyStateText : '';
	}

	render() {
		return html`
			<d2l-dropdown ?disabled="${this.disabled}" no-auto-open>
				<d2l-input-text
					@blur="${this._handleInputTextBlur}"
					@change="${this._handleChange}"
					class="d2l-dropdown-opener"
					?disabled="${this.disabled}"
					@keydown="${this._handleKeydown}"
					@focus="${this._handleInputTextFocus}"
					label="${ifDefined(this.label)}"
					?label-hidden="${this.labelHidden}"
					@mouseup="${this._handleMouseup}"
					placeholder="${(this._dateTimeDescriptor.formats.dateFormats.short).toUpperCase()}"
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
					max-width="335"
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
				this._getFormattedValue();
			}
		});
	}

	_getFormattedValue() {
		this._formattedValue = this.value ? formatISODateInUserCalDescriptor(this.value) : (this.emptyStateText ? this.emptyStateText : '');
	}

	async _handleFocusTrapEnter() {
		this._calendar.focus();
	}

	async _handleKeydown(e) {
		// open dropdown on down arrow or enter and focus on calendar focus date
		if (e.keyCode === 40 || e.keyCode === 13) {
			this._dropdown.open();
			await this._handleChange(e);
			this._calendar.focus();

			if (e.keyCode === 40) e.preventDefault();
		}
	}

	async _handleChange(e) {
		const value = e.target.value;
		if (!value) {
			if (value !== this.value) {
				this._updateValueDispatchEvent('');
				await this.updateComplete;
				this._calendar.reset();
			}
			return;
		}
		this._formattedValue = value;
		await this.updateComplete;
		try {
			const date = parseDate(value);
			this._updateValueDispatchEvent(formatDateInISO({year: date.getFullYear(), month: (parseInt(date.getMonth()) + 1), date: date.getDate()}));
		} catch (err) {
			// leave value the same when invalid input
		}
		this._getFormattedValue(); // keep out here in case parseDate is same date, e.g., user adds invalid text to end of parseable date
		await this.updateComplete;
		this._calendar.reset();
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
		this._calendar.reset();
		this._dropdownOpened = false;
	}

	_handleDropdownOpen() {
		this.shadowRoot.querySelector('d2l-focus-trap').scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
		this._dropdownOpened = true;
	}

	_handleInputTextFocus() {
		this._formattedValue = this.value ? formatISODateInUserCalDescriptor(this.value) : '';
	}

	_handleInputTextBlur() {
		this._getFormattedValue();
	}

	_handleMouseup(e) {
		if (!this.disabled) {
			if (!this._dropdownOpened) this._handleChange(e);
			this._dropdown.toggleOpen(false);
		}
	}

	_handleSetToToday() {
		const date = getToday();
		this._updateValueDispatchEvent(formatDateInISO(date));
		this._dropdown.close();
	}

	_updateValueDispatchEvent(dateInISO) {
		if (dateInISO === this.value) return;
		this.value = dateInISO;
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-date', InputDate);
