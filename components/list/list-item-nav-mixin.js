import '../colors/colors.js';
import { css } from 'lit';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { ListItemLinkMixin } from './list-item-link-mixin.js';

export const ListItemNavMixin = superclass => class extends ListItemLinkMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether the list item is the current page in a navigation context. At most one list item should have the `current` attribute at any time; this will be managed by the `list` after initial render.
			 * @type {boolean}
			 */
			current: { type: Boolean, reflect: true },
			/**
			 * Whether to prevent the default navigation behavior of the link
			 * @type {boolean}
			 */
			preventNavigation: { type: Boolean, attribute: 'prevent-navigation' },
			_childCurrent: { type: Boolean, reflect: true, attribute: '_child-current' },
			_focusingElem: { type: Boolean, reflect: true, attribute: '_focusing-elem' },
		};
	}

	static get styles() {

		const styles = [ css`
			:host([action-href]:not([action-href=""])) {
				--d2l-list-item-content-text-color: var(--d2l-color-ferrite);
			}
			.d2l-list-item-content ::slotted(*) {
				width: 100%;
			}
			:host([current]) d2l-button-add {
				--d2l-button-add-line-color: var(--d2l-color-celestine);
				--d2l-button-add-line-height: 3px;
				--d2l-button-add-focus-line-height: 3px;
			}
			:host([current]) [slot="outside-control-container"] {
				background-color: var(--d2l-color-regolith);
				border: 3px solid var(--d2l-color-celestine);
				margin-block: 0;
			}
			:host([current][_show-add-button]) [slot="outside-control-container"] {
				margin-bottom: -2px;
				margin-top: -1px;
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
		this._dontHideBottomBorder = true;
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

	_handleLinkClick(e) {
		if (!this._getDescendantClicked(e)) {
			this.current = true;
			this._childCurrent = false;
		}
		if (this.preventNavigation) e.preventDefault();
		super._handleLinkClick(e);
	}

	#handleFocusIn(e) {
		e.stopPropagation(); // prevent _focusing from being set on the parent
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
		await this.updateComplete;
		if (e.target === this) return;
		this._childCurrent = e.detail.value;
	}

};
