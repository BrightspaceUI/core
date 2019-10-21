export const MenuItemMixin = superclass => class extends superclass {

	static get properties() {
		return {
			disabled: { type: Boolean, reflect: true },
			first: { type: Boolean, reflect: true }, // set by d2l-menu
			hasChildView: { type: Boolean, attribute: 'has-child-view' },
			hidden: { type: Boolean, reflect: true },
			last: { type: String, reflect: true }, // set by d2l-menu
			role: { type: String, reflect: true },
			tabindex: { type: Number, reflect: true, attribute: 'tab-index' },
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

	firstUpdated() {
		super.firstUpdated();
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

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('blur', this.__onBlur);
		this.addEventListener('click', this.__onClick);
		this.addEventListener('d2l-hierarchical-view-hide-complete', this.__onHideComplete);
		this.addEventListener('dom-change', this.__onDomChange);
		this.addEventListener('focus', this.__onFocus);
		this.addEventListener('keydown', this.__onKeyDown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('blur', this.__onBlur);
		this.removeEventListener('click', this.__onClick);
		this.removeEventListener('d2l-hierarchical-view-hide-complete', this.__onHideComplete);
		this.removeEventListener('dom-change', this.__onDomChange);
		this.removeEventListener('focus', this.__onFocus);
		this.removeEventListener('keydown', this.__onKeyDown);
	}

	__initializeItem() {
		const children = Array.from(this.children);
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
		if (this._initialize) {
			this._initialize();
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

	__onBlur() {
		this.dispatchEvent(new CustomEvent('_blur', { bubbles: true, composed: true }));
	}

	__onClick(e) {
		e.stopPropagation();
		this.__action();
	}

	__onDomChange() {
		this.__initializeItem();
	}

	__onFocus() {
		this.dispatchEvent(new CustomEvent('_focus', { bubbles: true, composed: true }));
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
