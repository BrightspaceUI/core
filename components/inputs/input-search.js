import '../button/button-icon.js';
import '../colors/colors.js';
import './input-text.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputStyles } from './input-styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

export const INPUT_TIMEOUT_MS = 400;
export const SUPPRESS_ENTER_TIMEOUT_MS = 1000;

/**
 * This component wraps the native "<input type="search">"" element and is for text searching.
 * @slot inline-help - Help text that will appear below the input. Use this only when other helpful cues are not sufficient, such as a carefully-worded label.
 * @fires d2l-input-search-searched - Dispatched when a search is performed. When the input is cleared, this will be fired with an empty value.
 */
class InputSearch extends FocusMixin(LocalizeCoreElement(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: Additional information communicated to screenreader users when focusing on the input
			 * @type {string}
			 */
			description: { type: String, reflect: true },
			/**
			 * Disables the input
			 * @type {boolean}
			 */
			disabled: { type: Boolean },
			/**
			 * ACCESSIBILITY: REQUIRED: Acts as the primary label for the input. Not visible.
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * @ignore
			 */
			lastSearchValue: { type: String, attribute: false },
			/**
			 * Imposes an upper character limit
			 * @type {number}
			 */
			maxlength: { type: Number },
			/**
			 * Prevents the "clear" button from appearing
			 * @type {boolean}
			 */
			noClear: { type: Boolean, attribute: 'no-clear' },
			/**
			 * Placeholder text (default: "Search...")
			 * @type {string}
			 */
			placeholder: { type: String },
			/**
			 * Dispatch search events after each input event
			 * @type {boolean}
			 */
			searchOnInput: { type: Boolean, attribute: 'search-on-input' },
			/**
			 * Value of the input
			 * @type {string}
			 */
			value: { type: String }
		};
	}

	static get styles() {
		return [inputStyles, css`
				:host {
					display: inline-block;
					width: 100%;
				}
				:host([hidden]) {
					display: none;
				}
				d2l-button-icon {
					--d2l-button-icon-min-height: 1.5rem;
					--d2l-button-icon-min-width: 1.5rem;
					--d2l-button-icon-border-radius: 4px;
					--d2l-button-icon-focus-box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px var(--d2l-color-celestine);
					margin-left: 0.3rem;
					margin-right: 0.3rem;
				}
			`
		];
	}

	constructor() {
		super();
		this._inputTimeout = undefined;
		this._lastSearchValue = '';
		this._suppressEnter = false;
		this.disabled = false;
		this.noClear = false;
		this.searchOnInput = false;
		this.value = '';
	}

	/** @ignore */
	get lastSearchValue() { return this._lastSearchValue; }
	set lastSearchValue(val) {}

	static get focusElementSelector() {
		return 'd2l-input-text';
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.value !== undefined && this.value !== null) {
			this._setLastSearchValue(this.value);
		}
	}

	render() {
		const search = this._computeShowSearch() ? html`
			<d2l-button-icon
				?disabled="${this.disabled}"
				icon="tier1:search"
				@click="${this.search}"
				slot="right"
				text="${this.localize('components.input-search.search')}"></d2l-button-icon>` : html`
			<d2l-button-icon
				@click="${this._handleClearClick}"
				?disabled="${this.disabled}"
				icon="tier1:close-default"
				slot="right"
				text="${this.localize('components.input-search.clear')}"></d2l-button-icon>`;
		return html`
			<d2l-input-text
				label="${ifDefined(this.label)}"
				label-hidden
				description="${this.description}"
				?disabled="${this.disabled}"
				@input="${this._handleInput}"
				@keypress="${this._handleInputKeyPress}"
				maxlength="${ifDefined(this.maxlength)}"
				placeholder="${this.placeholder || this.localize('components.input-search.defaultPlaceholder')}"
				type="search"
				.value="${this.value}">
				${search}
				<slot slot="inline-help" name="inline-help"></slot>
			</d2l-input-text>
		`;
	}

	search() {
		this._setLastSearchValue(this.value);
		this._dispatchEvent();
		if (!this.noClear && this.value.length > 0) {
			this.updateComplete.then(() => {
				if (this.shadowRoot) this.shadowRoot.querySelector('d2l-button-icon').focus();
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

	_debounceInput() {
		clearTimeout(this._inputTimeout);
		this._setLastSearchValue(this.value);
		this._inputTimeout = setTimeout(() => this._dispatchEvent(), INPUT_TIMEOUT_MS);
	}

	_dispatchEvent() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-search-searched',
			{ bubbles: true, composed: false, detail: { value: this.value } }
		));
	}

	_handleClearClick() {
		this.value = '';
		if (this.value !== this.lastSearchValue) {
			this._setLastSearchValue('');
			this._dispatchEvent();
		}
		if (this.shadowRoot) this.shadowRoot.querySelector('d2l-input-text').focus();
	}

	_handleInput(e) {
		this.value = e.target.value;
		if (this.searchOnInput) {
			this._debounceInput();
		}
	}

	_handleInputKeyPress(e) {
		if (e.keyCode !== 13) {
			return;
		}
		e.preventDefault();
		const hasChanged = this._setLastSearchValue(this.value);
		if (!this._suppressEnter || hasChanged) {
			this._suppressEnter = true;
			setTimeout(() => this._suppressEnter = false, SUPPRESS_ENTER_TIMEOUT_MS);
			this._dispatchEvent();
		}
	}

	_setLastSearchValue(val) {
		const oldVal = this._lastSearchValue;
		this._lastSearchValue = val;
		this.requestUpdate('lastSearchValue', oldVal);
		return (oldVal !== val);
	}

}
customElements.define('d2l-input-search', InputSearch);
