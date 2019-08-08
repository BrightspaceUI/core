import { html } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export const DialogMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			title: { type: String },
			_height: { type: Number },
			_overflowBottom: { type: Boolean },
			_overflowTop: { type: Boolean },
			_state: { type: String, reflect: true },
			_width: { type: Number },
		};
	}

	constructor() {
		super();
		this.opened = false;
		this._height = 0;
		this._width = 0;
		this._hasNativeDialog = (window.HTMLDialogElement !== undefined);
		//this._hasNativeDialog = false;
		this._updateSize = this._updateSize.bind(this);
		this._updateOverflow = this._updateOverflow.bind(this);
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
		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		const transitionEnd = () => {
			dialog.removeEventListener('transitionend', transitionEnd);
			dialog.querySelector('.d2l-dialog-content').removeEventListener('scroll', this._updateOverflow);
			window.removeEventListener('resize', this._updateSize);
			if (this._hasNativeDialog) {
				dialog.close();
			}
			this._state = null;
			this.opened = false;
		};
		dialog.addEventListener('transitionend', transitionEnd);
		this._state = 'hiding';
	}

	_getHeight() {
		const availableHeight = window.innerHeight - 130;
		let preferredHeight = 0;

		const header = this.shadowRoot.querySelector('.d2l-dialog-header');
		if (header) preferredHeight += header.scrollHeight;

		const content = this.shadowRoot.querySelector('.d2l-dialog-content > div');
		if (content) preferredHeight += content.scrollHeight;

		const footer = this.shadowRoot.querySelector('.d2l-dialog-footer');
		if (footer) preferredHeight += footer.scrollHeight;

		const height = (preferredHeight < availableHeight ? preferredHeight : availableHeight);
		return height;
	}

	_getWidth() {
		const availableWidth = window.innerWidth - 60;
		const width = (this.width < availableWidth ? this.width : availableWidth);
		return width;
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

		window.addEventListener('resize', this._updateSize);
		this.shadowRoot.querySelector('.d2l-dialog-content').addEventListener('scroll', this._updateOverflow);

		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		if (this._hasNativeDialog) {
			dialog.showModal();
		}

		this._updateSize();

		requestAnimationFrame(() => {
			this._state = 'showing';
		});

	}

	_render(labelId, descriptionId, inner) {

		const styles = {};
		if (this._height) styles.height = `${this._height}px`;
		if (this._width) styles.width = `${this._width}px`;
		else styles.width = 'auto';

		return html`${this._hasNativeDialog ?
			html`<dialog
				aria-describedby="${ifDefined(descriptionId)}"
				aria-labelledby="${labelId}"
				class="d2l-dialog-outer"
				@close="${this._handleClose}"
				?overflow-bottom="${this._overflowBottom}"
				?overflow-top="${this._overflowTop}"
				style=${styleMap(styles)}>
					${inner}
				</dialog>` :
			html`<div
				aria-describedby="${ifDefined(descriptionId)}"
				aria-labelledby="${labelId}"
				class="d2l-dialog-outer"
				?overflow-bottom="${this._overflowBottom}"
				?overflow-top="${this._overflowTop}"
				role="dialog"
				style=${styleMap(styles)}>
					${inner}
				</div>`}
		`;

	}

	_updateOverflow() {
		const content = this.shadowRoot.querySelector('.d2l-dialog-content');
		this._overflowTop = (content.scrollTop > 0);
		this._overflowBottom = (content.scrollHeight > content.scrollTop + content.clientHeight);
	}

	async _updateSize() {
		this._width = this._getWidth();
		await this.updateComplete;
		this._height = this._getHeight();
		await this.updateComplete;
		this._updateOverflow();
	}

};
