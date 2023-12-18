export const MenuItemMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Disables the menu item
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * @ignore
			 */
			first: { type: Boolean, reflect: true }, // set by d2l-menu
			/**
			 * @ignore
			 */
			hasChildView: { type: Boolean },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			hidden: { type: Boolean, reflect: true },
			/**
			 * @ignore
			 */
			last: { type: String, reflect: true }, // set by d2l-menu
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			tabindex: { type: String, reflect: true },
			/**
			 * REQUIRED: Text displayed by the menu item
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * Provide a description for the menu item that will be used by screen readers
			 * @type {string}
			 */
			description: { type: String },
			_ariaDisabled: { type: String, attribute: 'aria-disabled', reflect: true },
			_ariaLabel: { type: String, attribute: 'aria-label', reflect: true }
		};
	}

	constructor() {
		super();
		this.__keyCodes = {
			ENTER: 13,
			LEFT: 37,
			RIGHT: 39,
			SPACE: 32
		};
		this.__children = null;

		this.disabled = false;
		/** @ignore */
		this.role = 'menuitem';
		/** @ignore */
		this.tabindex = -1;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('click', this.__onClick);
		this.addEventListener('d2l-hierarchical-view-hide-complete', this.__onHideComplete);
		this.addEventListener('dom-change', this.__onDomChange);
		this.addEventListener('keydown', this.__onKeyDown);

		this.__initializeItem();

		if (this.hidden) {
			this._onHidden();
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'hidden') {
				this._onHidden();
			} else if (propName === 'disabled') {
				this._ariaDisabled = this.disabled ? 'true' : 'false';
			} else if (propName === 'text' || propName === 'description') {
				this._ariaLabel = this.description || this.text;
			}
		});
	}

	__action() {
		if (this.disabled) {
			return;
		}

		if (this.__children && this.__children.length > 0 && this.__children[0].hierarchicalView) {
			// assumption: single, focusable child view
			this.__children[0].show();
		} else {
			/** Dispatched when the menu item is selected */
			this.dispatchEvent(new CustomEvent('d2l-menu-item-select', { bubbles: true, composed: true }));
		}
	}

	__initializeItem() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot:not([name])');
		if (!slot) {
			return;
		}
		const children = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
		if (children && children.length > 0 && children[0].tagName === 'TEMPLATE') {
			return;
		}

		for (let i = 0; i < children.length; i++) {
			if (children[i].tagName !== 'TEMPLATE' && children[i].tagName !== 'DOM-IF') {
				this.hasChildView = true;
				this.__children = children;
				this.setAttribute('aria-haspopup', true);
				this.__children[0].label = this.text;
				break;
			}
		}
	}

	__onClick(e) {
		e.stopPropagation();
		this.__action();
	}

	__onDomChange() {
		this.__initializeItem();
	}

	__onHideComplete(e) {
		if (this.__children.indexOf(e.target) === -1) {
			return;
		}
		if (e.detail.data && e.detail.data.preventFocus) {
			return;
		}
		this.focus();
	}

	__onKeyDown(e) {
		if (e.target !== this) {
			return;
		}
		if (e.keyCode === this.__keyCodes.ENTER || e.keyCode === this.__keyCodes.SPACE) {
			e.stopPropagation();
			e.preventDefault();
			this.__action();
			return;
		}
		if (this.__children && this.__children.length > 0 && e.keyCode === this.__keyCodes.RIGHT) {
			e.stopPropagation();
			this.__action();
			return;
		}
	}

	_onHidden() {
		/** Dispatched when the visibility of the menu item changes */
		this.dispatchEvent(new CustomEvent('d2l-menu-item-visibility-change', { bubbles: true, composed: true }));
	}

};
