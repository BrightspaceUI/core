import '../button/button-icon.js';
import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap} from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * This component wraps the native "<input type="search">"" element and is for text searching.
 * @fires d2l-input-search-searched - Dispatched when a search is performed
 */
class InputSearch extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * REQUIRED: Accessible label for the input
			 */
			label: { type: String },
			/**
			 * @ignore
			 */
			lastSearchValue: { type: String, attribute: false },
			/**
			 * Imposes an upper character limit
			 */
			maxlength: { type: Number },
			/**
			 * Prevents the "clear" button from appearing
			 */
			noClear: { type: Boolean, attribute: 'no-clear' },
			/**
			 * Placeholder text
			 */
			placeholder: { type: String },
			/**
			 * Value of the input
			 */
			value: { type: String },
			_focussed: { type: Boolean, attribute: false },
			_hovered: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [inputStyles, css`
				:host {
					display: inline-block;
					width: 100%;
				}
				.d2l-input-search-container {
					position: relative;
				}
				:host([hidden]) {
					display: none;
				}
				.d2l-input {
					-webkit-appearance: textfield;
					overflow: hidden;
					padding-right: 2.2rem;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				:host([dir="rtl"]) .d2l-input {
					padding-left: 2.2rem;
					padding-right: 0.75rem;
				}
				.d2l-input.d2l-input-focus {
					padding-right: calc(2.2rem - 1px);
				}
				:host([dir="rtl"]) .d2l-input:hover,
				:host([dir="rtl"]) .d2l-input:focus,
				:host([dir="rtl"]) .d2l-input.d2l-input-focus {
					padding-left: calc(2.2rem - 1px);
					padding-right: calc(0.75rem - 1px);
				}
				d2l-button-icon {
					--d2l-button-icon-min-height: 1.5rem;
					--d2l-button-icon-min-width: 1.5rem;
					--d2l-button-icon-border-radius: 4px;
					--d2l-button-icon-focus-box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px var(--d2l-color-celestine);
					position: absolute;
					right: 0.3rem;
					top: 50%;
					transform: translateY(-50%);
				}
				:host([dir="rtl"]) d2l-button-icon {
					left: 0.3rem;
					right: auto;
				}
			`
		];
	}

	constructor() {
		super();
		this._focussed = false;
		this._hovered = false;
		this._lastSearchValue = '';
		this.disabled = false;
		this.noClear = false;
		this.value = '';
	}

	get lastSearchValue() { return this._lastSearchValue; }
	set lastSearchValue(val) {}

	connectedCallback() {
		super.connectedCallback();
		if (this.value !== undefined && this.value !== null) {
			this._setLastSearchValue(this.value);
		}
		this.addEventListener('blur', this._handleBlur);
		this.addEventListener('focus', this._handleFocus);
	}

	disconnectedCallback() {
		this.removeEventListener('blur', this._handleBlur);
		this.removeEventListener('focus', this._handleFocus);
	}

	render() {
		const inputClasses = {
			'd2l-input': true,
			'd2l-input-focus': !this.disabled && (this._focussed || this._hovered)
		};
		const showSearch = this._computeShowSearch();
		return html`
			<div class="d2l-input-search-container"
				@mouseout="${this._handleMouseLeave}"
				@mouseover="${this._handleMouseEnter}">
				<input
					aria-label="${ifDefined(this.label)}"
					class="${classMap(inputClasses)}"
					?disabled="${this.disabled}"
					@input="${this._handleInput}"
					@keypress="${this._handleInputKeyPress}"
					maxlength="${ifDefined(this.maxlength)}"
					placeholder="${ifDefined(this.placeholder)}"
					type="search"
					.value="${this.value}">${showSearch ? html`
					<d2l-button-icon
						?disabled="${this.disabled}"
						icon="tier1:search"
						@click="${this.search}"
						text="${this.localize('components.input-search.search')}"></d2l-button-icon>` : html`
					<d2l-button-icon
						@click="${this._handleClearClick}"
						?disabled="${this.disabled}"
						icon="tier1:close-default"
						text="${this.localize('components.input-search.clear')}"></d2l-button-icon>`}
			</div>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

	search() {
		this._setLastSearchValue(this.value);
		this._dispatchEvent();
		if (!this.noClear && this.value.length > 0) {
			this.updateComplete.then(() => {
				this.shadowRoot.querySelector('d2l-button-icon').focus();
			});
		}
	}

	_computeShowSearch() {
		const valueIsEmpty = (this.value === undefined || this.value === null || this.value === '');
		const lastSearchValueIsEmpty = (this.lastSearchValue === undefined || this.lastSearchValue === null || this.lastSearchValue === '');
		const showSearch = (valueIsEmpty && lastSearchValueIsEmpty) ||
			(this.lastSearchValue !== this.value) || this.noClear;
		return showSearch;
	}

	_dispatchEvent() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-search-searched',
			{bubbles: true, composed: false, detail: {value: this.value}}
		));
	}

	_handleBlur() {
		this._focussed = false;
	}

	_handleClearClick() {
		this.value = '';
		if (this.value !== this.lastSearchValue) {
			this._setLastSearchValue('');
			this._dispatchEvent();
		}
		this.shadowRoot.querySelector('.d2l-input').focus();
	}

	_handleFocus() {
		this._focussed = true;
	}

	_handleInput(e) {
		this.value = e.target.value;
	}

	_handleInputKeyPress(e) {
		if (e.keyCode !== 13) {
			return;
		}
		e.preventDefault();
		this._setLastSearchValue(this.value);
		this._dispatchEvent();
	}

	_handleMouseEnter() {
		this._hovered = true;
	}

	_handleMouseLeave() {
		this._hovered = false;
	}

	_setLastSearchValue(val) {
		const oldVal = this._lastSearchValue;
		this._lastSearchValue = val;
		this.requestUpdate('lastSearchValue', oldVal);
	}

}
customElements.define('d2l-input-search', InputSearch);
