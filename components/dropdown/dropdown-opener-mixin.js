export const DropdownOpenerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			dropdownOpener: {
				type: Boolean
			},
			noAutoOpen: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-open'
			},
			disabled: {
				type: Boolean,
				reflect: true
			}
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-dropdown-open', this.__onOpened);
		this.addEventListener('d2l-dropdown-close', this.__onClosed);
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

	/**
	 * Applies focus to opener.
	 */
	focus() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.focus();
	}

	/**
	 * Gets the opener component.
	 */
	getOpener() {
		return this;
	}

	/**
	 * Gets the opener element (required by d2l-dropdown behavior).
	 * @return {HTMLElement}
	 */
	getOpenerElement() {
		return this;
	}

	/**
	 * Toggles the visible state of the dropdown. If open, it will close, and vice versa.
	 * @param {Boolean} applyFocus Whether focus should be automatically move to first focusable upon opening.
	 */
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
		return this.shadowRoot.querySelector('slot').assignedNodes().find(
			node => node.nodeType === 1 && node.nodeName === 'D2L-DROPDOWN-CONTENT'
		);
	}

	__onKeyPress(e) {
		if (e.keyCode !== 13) {
			return;
		}
		if (this.noAutoOpen) {
			return;
		}
		this.toggleOpen(true);
	}

	__onMouseUp() {
		if (this.noAutoOpen) {
			return;
		}
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

	__onClosed() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-expanded', 'false');
		opener.removeAttribute('active');
	}

};
