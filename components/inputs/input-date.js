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
import { styleMap } from 'lit-html/directives/style-map.js';

export function formatISODateInUserCalDescriptor(val) {
	return formatDate(getDateFromISODate(val));
}

class InputDate extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			emptyText: { type: String, attribute: 'empty-text'},
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			minValue: { attribute: 'min-value', reflect: true, type: String },
			value: { type: String },
			_hiddenContentWidth: { type: String },
			_dateTimeDescriptor: { type: Object },
			_dropdownOpened: { type: Boolean },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-dropdown {
				width: 100%;
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
			.d2l-input-date-hidden-content {
				font-family: inherit;
				font-size: 0.8rem;
				font-weight: 400;
				letter-spacing: 0.02rem;
				line-height: 1.4rem;
				position: absolute;
				visibility: hidden;
				width: auto;
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
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today',
			},
			'da': {
				clear: 'Ryd',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today',
			},
			'de': {
				clear: 'Löschen',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'en': {
				clear: 'Clear',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'es': {
				clear: 'Borrar',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'fr': {
				clear: 'Effacer',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'ja': {
				clear: 'クリア',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'ko': {
				clear: '지우기',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'nl': {
				clear: 'Wissen',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'pt': {
				clear: 'Desmarcar',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'sv': {
				clear: 'Rensa',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'tr': {
				clear: 'Temizle',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'zh': {
				clear: '清除',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			},
			'zh-tw': {
				clear: '清除',
				openInstructions: 'Use date format {format}. Arrow down or press enter to access mini-calendar.',
				setToToday: 'Set to Today'
			}
		};
	}

	constructor() {
		super();

		this.emptyText = '';
		this.value = '';

		this._dropdownOpened = false;
		this._formattedValue = '';
		this._hiddenContentWidth = '8rem';

		this._dateTimeDescriptor = getDateTimeDescriptorShared();
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date component requires label text');
		}

		this._calendar = this.shadowRoot.querySelector('d2l-calendar');
		this._dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');
		this._textInput = this.shadowRoot.querySelector('d2l-input-text');

		this.addEventListener('blur', this._handleBlur);
		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			this._dateTimeDescriptor = getDateTimeDescriptorShared(true);
			this.requestUpdate().then(() => {
				const width = Math.ceil(parseFloat(getComputedStyle(this.shadowRoot.querySelector('.d2l-input-date-hidden-content')).getPropertyValue('width')));
				this._hiddenContentWidth = `${width}px`;
			});
		});

		this._formattedValue = this.emptyText ? this.emptyText : '';

		await (document.fonts ? document.fonts.ready : Promise.resolve());
		const width = Math.ceil(parseFloat(getComputedStyle(this.shadowRoot.querySelector('.d2l-input-date-hidden-content')).getPropertyValue('width')));
		this._hiddenContentWidth = `${width}px`;
	}

	render() {
		const formattedWideDate = formatISODateInUserCalDescriptor('2323-12-23');
		const inputTextWidth = `calc(${this._hiddenContentWidth} + 0.75rem + 3px)`; // text and icon width + paddingRight + border width + 1
		const shortDateFormat = (this._dateTimeDescriptor.formats.dateFormats.short).toUpperCase();

		this.style.maxWidth = inputTextWidth;

		return html`
			<div aria-hidden="true" class="d2l-input-date-hidden-content">
				<div><d2l-icon icon="tier1:calendar"></d2l-icon>${formattedWideDate}</div>
				<div><d2l-icon icon="tier1:calendar"></d2l-icon>${shortDateFormat}</div>
				<div><d2l-icon icon="tier1:calendar"></d2l-icon>${this.emptyText}</div>
			</div>
			<d2l-dropdown ?disabled="${this.disabled}" no-auto-open>
				<d2l-input-text
					@change="${this._handleChange}"
					class="d2l-dropdown-opener"
					?disabled="${this.disabled}"
					@focus="${this._handleInputTextFocus}"
					@keydown="${this._handleKeydown}"
					label="${ifDefined(this.label)}"
					?label-hidden="${this.labelHidden}"
					@mouseup="${this._handleMouseup}"
					placeholder="${shortDateFormat}"
					style="${styleMap({maxWidth: inputTextWidth})}"
					title="${this.localize('openInstructions', {format: shortDateFormat})}"
					.value="${this._formattedValue}">
					<d2l-icon
						icon="tier1:calendar"
						slot="left"></d2l-icon>
				</d2l-input-text>
				<d2l-dropdown-content
					@d2l-dropdown-close="${this._handleDropdownClose}"
					@d2l-dropdown-open="${this._handleDropdownOpen}"
					max-width="335"
					no-auto-fit
					no-auto-focus
					no-padding>
					<d2l-focus-trap @d2l-focus-trap-enter="${this._handleFocusTrapEnter}" ?trap="${this._dropdownOpened}">
						<d2l-calendar
							@d2l-calendar-selected="${this._handleDateSelected}"
							max-value="${ifDefined(this.maxValue)}"
							min-value="${ifDefined(this.minValue)}"
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

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_dateTimeDescriptor' || prop === 'value') {
				this._setFormattedValue();
			}
		});
	}

	focus() {
		if (this._textInput) this._textInput.focus();
	}

	_handleBlur() {
		this._setFormattedValue();
	}

	async _handleChange() {
		const value = this._textInput.value;
		if (!value) {
			if (value !== this.value) {
				this._updateValueDispatchEvent('');
				await this.updateComplete;
				await this._calendar.reset();
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
		this._setFormattedValue(); // keep out here in case parseDate is same date, e.g., user adds invalid text to end of parseable date
		await this.updateComplete;
		await this._calendar.reset();
	}

	_handleClear() {
		this._updateValueDispatchEvent('');
		this._dropdown.close();
		this.focus();
	}

	_handleDateSelected(e) {
		const value = e.target.selectedValue;
		this._updateValueDispatchEvent(value);
		this._dropdown.close();
	}

	_handleDropdownClose() {
		this._calendar.reset();
		this._dropdownOpened = false;
		this._textInput.scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
	}

	_handleDropdownOpen() {
		if (!this._dropdown.openedAbove) this.shadowRoot.querySelector('d2l-focus-trap').scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
		// use setTimeout to wait for keyboard to open on mobile devices
		setTimeout(() => {
			this._textInput.scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'nearest'});
		}, 150);
		this._dropdownOpened = true;
	}

	async _handleFocusTrapEnter() {
		this._calendar.focus();
	}

	_handleInputTextFocus() {
		this._formattedValue = this.value ? formatISODateInUserCalDescriptor(this.value) : '';
	}

	async _handleKeydown(e) {
		// open dropdown on down arrow or enter and focus on calendar focus date
		if (e.keyCode === 40 || e.keyCode === 13) {
			this._dropdown.open();
			await this._handleChange();
			this._calendar.focus();
			this._setFormattedValue();
			e.preventDefault();
		}
	}

	_handleMouseup() {
		if (!this.disabled) {
			if (!this._dropdownOpened) this._handleChange();
			this._dropdown.toggleOpen(false);
		}
	}

	_handleSetToToday() {
		const date = getToday();
		this._updateValueDispatchEvent(formatDateInISO(date));
		this._dropdown.close();
		this.focus();
	}

	_setFormattedValue() {
		this._formattedValue = this.value ? formatISODateInUserCalDescriptor(this.value) : (this.emptyText ? this.emptyText : '');
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
