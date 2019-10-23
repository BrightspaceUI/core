export const MenuItemMixin = superclass => class extends superclass {

	static get properties() {
		return {
			disabled: { type: Boolean, reflect: true },
			first: { type: Boolean, reflect: true }, // set by d2l-menu
			hasChildView: { type: Boolean, attribute: 'has-child-view' },
			hidden: { type: Boolean, reflect: true },
			last: { type: String, reflect: true }, // set by d2l-menu
			role: { type: String, reflect: true },
			text: String
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
		this.role = 'menuitem';
		this.tabindex = -1;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('click', this.__onClick);
		this.removeEventListener('d2l-hierarchical-view-hide-complete', this.__onHideComplete);
		this.removeEventListener('dom-change', this.__onDomChange);
		this.removeEventListener('keydown', this.__onKeyDown);
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('click', this.__onClick);
		this.addEventListener('d2l-hierarchical-view-hide-complete', this.__onHideComplete);
		this.addEventListener('dom-change', this.__onDomChange);
		this.addEventListener('keydown', this.__onKeyDown);
		this.__initializeItem();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'hidden') {
				this._onHidden();
			}
		});
	}

	__initializeItem() {
		const slot = this.shadowRoot.querySelector('slot');
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

	__action() {

		if (this.disabled) {
			return;
		}

		if (this.__children && this.__children.length > 0 && this.__children[0].isHierarchicalView) {
			// assumption: single, focusable child view
			this.__children[0].show();
		} else {
			this.dispatchEvent(new CustomEvent('d2l-menu-item-select', { bubbles: true, composed: true }));
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

	_onHidden() {
		this.dispatchEvent(new CustomEvent('d2l-menu-item-visibility-change', { bubbles: true, composed: true }));
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

};
