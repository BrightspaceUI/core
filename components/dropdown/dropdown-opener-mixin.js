const keyCodes = Object.freeze({
	DOWN: 40,
	END: 35,
	ENTER: 13,
	HOME: 36,
	LEFT: 37,
	PAGEUP: 33,
	PAGEDOWN: 34,
	RIGHT: 39,
	SPACE: 32,
	UP: 38
});

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

		this.__onKeyUp = this.__onKeyUp.bind(this);
		this.__onClick = this.__onClick.bind(this);
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
			opener.addEventListener('keyup', this.__onKeyUp);
			opener.addEventListener('click', this.__onClick);
			opener.setAttribute('aria-expanded', (content && content.opened || false).toString());
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.addEventListener('keyup', this.__onKeyUp);
		opener.addEventListener('click', this.__onClick);
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
		return this.shadowRoot.querySelector('slot').assignedNodes().filter(node => node.hasAttribute && node.hasAttribute('dropdown-content'))[0];
	}

	__onClick() {
		if (this.noAutoOpen) return;
		this.toggleOpen(false);
	}

	__onClosed() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-expanded', 'false');
		opener.removeAttribute('active');
	}

	__onKeyUp(e) {
		if (this.noAutoOpen) return;
		switch (e.keyCode) {
			case keyCodes.ENTER:
			case keyCodes.SPACE:
				this.toggleOpen(true);
				e.preventDefault();
				e.stopPropagation();
				break;
			default:
				break;
		}
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
