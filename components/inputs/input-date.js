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
			value: { type: String },
			_contentWidth: { type: Number },
			_dateTimeDescriptor: { type: Object },
			_dropdownOpened: { type: Boolean },
			_formattedValue: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
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

		this._dateTimeDescriptor = getDateTimeDescriptorShared();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date component requires label text');
		}

		this._dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');
		this._calendar = this.shadowRoot.querySelector('d2l-calendar');

		this.addEventListener('blur', this._handleBlur);
		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			this._dateTimeDescriptor = getDateTimeDescriptorShared(true);
			this._getContentWidth();
		});

		this._formattedValue = this.emptyText ? this.emptyText : '';
		this._getContentWidth();
	}

	render() {
		const shortDateFormat = (this._dateTimeDescriptor.formats.dateFormats.short).toUpperCase();
		const width = this._contentWidth ? `calc(${this._contentWidth}px + 0.75rem + 2px + 5px)` : '9rem'; // text and icon width + paddingRight + border width
		console.log(`WIDTH: ${width}`);
		return html`
			<d2l-dropdown ?disabled="${this.disabled}" no-auto-open>
				<d2l-input-text
					@change="${this._handleChange}"
					class="d2l-dropdown-opener"
					?disabled="${this.disabled}"
					@keydown="${this._handleKeydown}"
					@focus="${this._handleInputTextFocus}"
					label="${ifDefined(this.label)}"
					?label-hidden="${this.labelHidden}"
					@mouseup="${this._handleMouseup}"
					placeholder="${shortDateFormat}"
					style="${styleMap({maxWidth: width})}"
					title="${this.localize('openInstructions', {format: shortDateFormat})}"
					.value="${this._formattedValue}">
					<d2l-icon
						?disabled="${this.disabled}"
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
			if (prop === '_dateTimeDescriptor' || prop === 'value') {
				this._setFormattedValue();
			}
		});
	}

	_getContentWidth() {
		const text = document.createElement('div');
		document.body.appendChild(text);
		text.style.fontSize = '0.8rem';
		text.style.letterSpacing = '0.02rem';
		text.style.position = 'absolute';
		text.style.width = 'auto';
		text.style.fontFamily = 'Lato';
		text.style.fontWeight = '400';
		text.style.lineHeight = '1.4rem';

		// in some languages (e.g., fr) placeholderWidth is bigger, in others (e.g., zh) contentWidth is bigger
		text.innerText = (this._dateTimeDescriptor.formats.dateFormats.short).toUpperCase();
		const placeholderWidth = text.getBoundingClientRect().width;
		text.innerText = formatISODateInUserCalDescriptor('2020-12-20');
		const contentWidth = text.getBoundingClientRect().width;

		let emptyStateWidth = 0;
		if (this.emptyText) {
			text.innerText = this.emptyText;
			emptyStateWidth = text.getBoundingClientRect().width;
		}
		const textWidth = Math.max(placeholderWidth, contentWidth, emptyStateWidth);
		// document.body.removeChild(text);

		const icon = this.shadowRoot.querySelector('d2l-icon');
		const iconStyle = getComputedStyle(icon);
		const iconTotalWidth = parseFloat(iconStyle.width) + parseFloat(iconStyle.marginLeft) + parseFloat(iconStyle.marginRight);
		console.log(`TEXT: ${textWidth}, CONTENT WIDTH: ${contentWidth}`);

		this._contentWidth = Math.ceil(textWidth + iconTotalWidth);
	}

	_handleBlur() {
		this._setFormattedValue();
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
			this._setFormattedValue();

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
		this._setFormattedValue(); // keep out here in case parseDate is same date, e.g., user adds invalid text to end of parseable date
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
