import '../button/button-icon.js';
import '../colors/colors.js';
import './input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
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
			 * Placeholder text (default: "Search...")
			 */
			placeholder: { type: String },
			/**
			 * Value of the input
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
				?disabled="${this.disabled}"
				@input="${this._handleInput}"
				@keypress="${this._handleInputKeyPress}"
				maxlength="${ifDefined(this.maxlength)}"
				placeholder="${this.placeholder || this.localize('components.input-search.defaultPlaceholder')}"
				type="search"
				.value="${this.value}">
				${search}
			</d2l-input-text>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-text');
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
			{ bubbles: true, composed: false, detail: { value: this.value } }
		));
	}

	_handleClearClick() {
		this.value = '';
		if (this.value !== this.lastSearchValue) {
			this._setLastSearchValue('');
			this._dispatchEvent();
		}
		this.shadowRoot.querySelector('d2l-input-text').focus();
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

	_setLastSearchValue(val) {
		const oldVal = this._lastSearchValue;
		this._lastSearchValue = val;
		this.requestUpdate('lastSearchValue', oldVal);
	}

}
customElements.define('d2l-input-search', InputSearch);
