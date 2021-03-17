export const DropdownOpenerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Disables the dropdown opener
			 */
			disabled: {
				type: Boolean,
				reflect: true
			},

			/**
			 * @ignore
			 */
			dropdownOpener: {
				type: Boolean
			},

			/**
			 * Prevents the dropdown from opening automatically on or on key press
			 */
			noAutoOpen: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-open'
			},
		};
	}

	constructor() {
		super();
		this.dropdownOpener = true;
		this.noAutoOpen = false;
		this.disabled = false;

		this.__onKeyPress = this.__onKeyPress.bind(this);
		this.__onMouseUp = this.__onMouseUp.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();

		requestAnimationFrame(() => {
			const opener = this.getOpenerElement();
			const content = this.__getContentElement();
			if (!opener) {
				return;
			}
			opener.setAttribute('aria-haspopup', 'true');
			opener.addEventListener('keypress', this.__onKeyPress);
			opener.addEventListener('mouseup', this.__onMouseUp);
			opener.setAttribute('aria-expanded', (content && content.opened || false).toString());
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.removeEventListener('keypress', this.__onKeyPress);
		opener.removeEventListener('mouseup', this.__onMouseUp);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-dropdown-open', this.__onOpened);
		this.addEventListener('d2l-dropdown-close', this.__onClosed);
	}

	focus() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.focus();
	}

	getContentSlot() {
		return this.shadowRoot.querySelector('slot');
	}

	getOpener() {
		return this;
	}

	getOpenerElement() {
		return this;
	}

	toggleOpen(applyFocus) {
		if (this.disabled) {
			return;
		}

		const content = this.__getContentElement();
		if (!content) {
			return;
		}
		content.toggleOpen(applyFocus);
	}

	__getContentElement() {
		return this.getContentSlot().assignedNodes()
			.filter(node => node.hasAttribute && node.hasAttribute('dropdown-content'))[0];
	}

	__onClosed() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-expanded', 'false');
		opener.removeAttribute('active');
	}

	__onKeyPress(e) {
		if (e.keyCode !== 13 && e.keyCode !== 32) return;
		if (this.noAutoOpen) return;
		this.toggleOpen(true);
	}

	__onMouseUp() {
		if (this.noAutoOpen) return;
		this.toggleOpen(false);
	}

	__onOpened() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-expanded', 'true');
		opener.setAttribute('active', 'true');
	}

};
