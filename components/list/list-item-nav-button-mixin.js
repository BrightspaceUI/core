import '../colors/colors.js';
import { css } from 'lit';
import { ListItemButtonMixin } from './list-item-button-mixin.js';

export const ListItemNavButtonMixin = superclass => class extends ListItemButtonMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether the list item is the current page in a navigation context. At most one list item should have the `current` attribute at any time; this will be managed by the `list` after initial render.
			 * @type {boolean}
			 */
			current: { type: Boolean, reflect: true },
			_childCurrent: { type: Boolean, reflect: true, attribute: '_child-current' },
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				--d2l-list-item-border-color: var(--d2l-color-mica) !important; /* clean up with flag GAUD-7495-list-item-new-styles */
			}
			:host(:not([button-disabled])) {
				--d2l-list-item-content-text-color: var(--d2l-color-ferrite);
			}
			.d2l-list-item-content ::slotted(*) {
				width: 100%;
			}
			:host([current]) [slot="outside-control-container"] {
				--d2l-list-item-border-color: var(--d2l-color-celestine);
				background-color: var(--d2l-color-regolith);
				border: 3px solid var(--d2l-color-celestine);
				margin-block: -1px;
			}
			:host([current]) [slot="control-container"]::before,
			:host([current]) [slot="control-container"]::after {
				border-color: transparent;
			}
			:host([_hovering-primary-action]) .d2l-list-item-content,
			:host([_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-color: var(--d2l-color-ferrite);
				--d2l-list-item-content-text-decoration: none;
			}

			/* clean up below with flag GAUD-7495-list-item-new-styles */
			:host(:not([selection-disabled]):not([button-disabled]):not([skeleton])[_focusing]) [slot="outside-control-container"] {
				border-color: var(--d2l-list-item-border-color);
				margin-bottom: -1px;
			}
			@media only screen and (hover: hover), only screen and (pointer: fine) {
				:host([_focusing]) d2l-list-item-drag-handle {
					opacity: 1;
				}
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

		this.addEventListener('focusin', this.#stopPropagation);
		this.addEventListener('focusout', this.#stopPropagation);
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
		if (e.target === this) return;
		this._childCurrent = e.detail.value;
	}

	#stopPropagation(e) {
		e.stopPropagation();
	}

};
