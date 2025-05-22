import '../colors/colors.js';
import { css } from 'lit';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
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
			_focusingElem: { type: Boolean, reflect: true, attribute: '_focusing-elem' },
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
				background-color: var(--d2l-color-regolith);
				border: 3px solid var(--d2l-color-celestine) !important;
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

		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = false;
		this._childCurrent = false;
		this._focusingElem = false;
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

		this.addEventListener('focusin', this.#handleFocusIn);
		this.addEventListener('focusout', this.#handleFocusOut);
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

	#handleFocusIn() {
		requestAnimationFrame(() => {
			const activeElement = getComposedActiveElement();
			const parentListItem = findComposedAncestor(activeElement, (node) => node.role === 'row' || node.role === 'listitem');
			if (parentListItem && parentListItem === this) {
				this._focusingElem = true;
			}
		});
	}

	#handleFocusOut() {
		this._focusingElem = false;
	}

	#setAriaCurrent(val) {
		this._ariaCurrent = val;
	}

	async #setChildCurrent(e) {
		await this.updateComplete; // ensure button exists
		if (e.target === this) return;
		this._childCurrent = e.detail.value;
	}

};
