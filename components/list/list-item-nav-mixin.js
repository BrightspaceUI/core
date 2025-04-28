import '../colors/colors.js';
import { css } from 'lit';
import { ListItemButtonMixin } from './list-item-button-mixin.js';

export const ListItemNavMixin = superclass => class extends ListItemButtonMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether the list item is the current page in a navigation context
			 * @type {boolean}
			 */
			current: { type: Boolean, reflect: true },
			_childCurrent: { type: Boolean, reflect: true, attribute: '_child-current' },
		};
	}

	static get styles() {

		const styles = [ css`
			:host(:not([button-disabled])) {
				--d2l-list-item-content-text-color: var(--d2l-color-ferrite);
			}
			.d2l-list-item-content ::slotted(*) {
				width: 100%;
			}
			:host([current]) [slot="outside-control-container"] {
				border: 3px solid var(--d2l-color-celestine);
				margin-block: -1px;
			}
			:host([_focusing-primary-action]:not([current])) [slot="outside-control-container"] {
				border: 2px solid var(--d2l-color-celestine);
			}
			:host([current]) [slot="control-container"]::before,
			:host([current]) [slot="control-container"]::after {
				border-color: transparent;
			}
			:host([_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-outline: none;
			}
			:host([_hovering-primary-action]) .d2l-list-item-content,
			:host([_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-color: var(--d2l-color-ferrite);
				--d2l-list-item-content-text-decoration: none;
			}

		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = false;
		this._childCurrent = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-item-nav-set-child-current', this.#setChildCurrent);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-list-item-nav-set-child-current', this.#setChildCurrent);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.current) {
			this.dispatchSetChildCurrentEvent(true);
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.get('current') !== undefined) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-list-item-property-change', { bubbles: true, composed: true, detail: { name: 'current', value: this.current } }));
		}
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('current') || changedProperties.has('_childCurrent')) {
			if (this.current) {
				this.#setAriaCurrent('page');
			} else if (this._childCurrent) {
				this.#setAriaCurrent('location');
			} else {
				this.#setAriaCurrent(undefined);
			}
		}
	}

	/**
	 * Internal. Do not use.
	 */
	dispatchSetChildCurrentEvent(val) {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-nav-set-child-current', { bubbles: true, composed: true, detail: { value: val } }));
	}

	_onButtonClick(e) {
		if (!this._getDescendantClicked(e)) {
			this.current = true;
			this._childCurrent = false;
		}
		super._onButtonClick(e);
	}

	#setAriaCurrent(val) {
		this._ariaCurrent = val;
	}

	async #setChildCurrent(e) {
		await this.updateComplete; // ensure button exists
		if (e.target === this || !this._button) return;
		this._childCurrent = e.detail.value;
	}

};
