export const DropdownContentMixin = superclass => class extends superclass {

	static get properties() {
		return {
			minWidth: {
				type: Number,
				reflect: true
			},
			maxWidth: {
				type: Number,
				reflect: true
			},
			opened: {
				type: Boolean,
				reflect: true
			},
		};
	}

	constructor() {
		super();
		this.__applyFocus = true;
	}

	/**
	 * Toggles the opened/closed state of the dropdown.  If closed, it will open, and vice versa.
	 * @param {Boolean} applyFocus Whether focus should be automatically moved to first focusable upon opening.
	 */
	toggleOpen(applyFocus) {
		if (this.opened) {
			this.close();
		} else {
			this.open(applyFocus);
		}
	}

	/**
	 * Opens/shows the dropdown.
	 * @param {Boolean} applyFocus Whether focus should be automatically move to first focusable upon opening.
	 */
	open(applyFocus) {
		this.__applyFocus = applyFocus !== undefined ? applyFocus : true;
		this.opened = true;
	}

	/**
     * Closes/hides the dropdown.
     */
	close() {
		this.opened = false;
	}
};
