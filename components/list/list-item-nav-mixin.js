import '../colors/colors.js';
import { css } from 'lit';
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
			_hasCurrentParent: { type: Boolean, reflect: true, attribute: '_has-current-parent' },
			_nextSiblingCurrent: { type: Boolean, reflect: true, attribute: '_next-sibling-current' },
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
			:host([current]) [slot="outside-control-container"] {
				background-color: var(--d2l-color-regolith);
				border: 3px solid var(--d2l-color-celestine);
				margin-block: 0;
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
			:host([current]) d2l-button-add,
			:host([_has-current-parent]) [slot="add-top"] d2l-button-add,
			:host([_next-sibling-current]) [slot="add"] d2l-button-add {
				--d2l-button-add-hover-focus-line-height: 3px;
				--d2l-button-add-line-color: var(--d2l-color-celestine);
				--d2l-button-add-line-height: 3px;
			}
			:host([current]) [slot="add"],
			:host([_has-current-parent]) [slot="add-top"] {
				margin-bottom: -14.5px;
				margin-top: -13.5px;
			}
			:host([current]) [slot="add-top"],
			:host([_next-sibling-current]) [slot="add"] {
				margin-bottom: -13.5px;
				margin-top: -10.5px;
			}
			:host([current]) .d2l-list-item-color-outer {
				padding-block: 3px;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = false;
		this._childCurrent = false;
		this._hasCurrentParent = false;
		this._nextSiblingCurrent = false;
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

		if (!val) return;
		requestAnimationFrame(() => {
			if (this._hasNestedListAddButton) {
				const firstChild = this.querySelector('[first]');
				if (firstChild) firstChild._hasCurrentParent = true;
			}

			const prevSibling = this._getPreviousListItemSibling();
			if (prevSibling) {
				if (prevSibling._showAddButton) prevSibling._nextSiblingCurrent = true;

				if (prevSibling._hasNestedListAddButton) {
					const lastChild = prevSibling.querySelector('[last]');
					if (lastChild) lastChild._nextSiblingCurrent = true;
				}
			}
		});
	}

	_handleLinkClick(e) {
		if (!this._getDescendantClicked(e)) {
			this.current = true;
			this._childCurrent = false;
		}
		if (this.preventNavigation) e.preventDefault();
		super._handleLinkClick(e);
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
