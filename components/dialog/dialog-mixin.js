export const DialogMixin = superclass => class extends superclass {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			title: { type: String },
			width: { type: Number },
			_state: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.opened = false;
		this._hasNativeDialog = (window.HTMLDialogElement !== undefined);
		//this._hasNativeDialog = false;
	}

	attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback(name, oldval, newval);
		if (name === 'opened' && oldval !== newval) {
			if (this.opened) this._open();
			else this._close();
		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('keydown', this._handleKeyDown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('keydown', this._handleKeyDown);
	}

	_close() {
		if (!this._state) return;
		const dialog = this.shadowRoot.querySelector('.d2l-dialog');
		const transitionEnd = () => {
			dialog.removeEventListener('transitionend', transitionEnd);
			if (this._hasNativeDialog) {
				dialog.close();
			}
			this._state = null;
			this.opened = false;
		};
		dialog.addEventListener('transitionend', transitionEnd);
		this._state = 'hiding';
	}

	_handleClose() {
		/* reset state if native dialog closes unexpectedly. ex. user highlights
		text and then hits escape key - this is not caught by our key handler */
		this._state = null;
		this.opened = false;
	}

	_handleKeyDown(e) {
		if (!this.opened) return;
		if (e.keyCode === 27) {
			// escape (note: prevent native dialog close so we can animate it)
			e.stopPropagation();
			e.preventDefault();
			this._close();
		}
	}

	_open() {
		if (!this.opened) return;

		const dialog = this.shadowRoot.querySelector('.d2l-dialog');
		if (this._hasNativeDialog) {
			dialog.showModal();
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				dialog.style.width = `${this.width}px`;
				this._state = 'showing';
			});
		});
	}

};
