import { getComposedActiveElement, getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { html } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { isComposedAncestor } from '../../helpers/dom.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export const DialogMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			titleText: { type: String, attribute: 'title-text' },
			_height: { type: Number },
			_overflowBottom: { type: Boolean },
			_overflowTop: { type: Boolean },
			_margin: { type: Object },
			_state: { type: String, reflect: true },
			_width: { type: Number },
		};
	}

	constructor() {
		super();
		this.opened = false;
		this._height = 0;
		this._margin = { top: 100, right: 30, bottom: 30, left: 30 };
		this._width = 0;
		this._hasNativeDialog = (window.HTMLDialogElement !== undefined);
		//this._hasNativeDialog = false;
		this._handleBodyFocus = this._handleBodyFocus.bind(this);
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

	_addHandlers() {
		window.addEventListener('resize', this._updateSize);
		document.body.addEventListener('focus', this._handleBodyFocus, true);
		this.shadowRoot.querySelector('.d2l-dialog-content').addEventListener('scroll', this._updateOverflow);
	}

	_close() {
		if (!this._state) return;
		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		const transitionEnd = () => {
			dialog.removeEventListener('transitionend', transitionEnd);
			this._removeHandlers();
			if (this._hasNativeDialog) dialog.close();
			this._focusOpener();
			this._state = null;
			this.opened = false;
		};
		dialog.addEventListener('transitionend', transitionEnd);
		this._state = 'hiding';
	}

	_focusOpener() {
		if (this._opener && this._opener.focus) {
			this._opener.focus();
			this._opener = null;
		}
	}

	_focusFirst() {
		const content = this.shadowRoot.querySelector('.d2l-dialog-content');
		if (content) {
			const firstFocusable = getNextFocusable(content);
			if (!firstFocusable.classList.contains('d2l-dialog-trap-end')) {
				firstFocusable.focus();
				return;
			}
		}
		this.shadowRoot.querySelector('.d2l-dialog-trap-start').focus();
	}

	_getHeight() {
		const availableHeight = window.innerHeight - this._margin.top - this._margin.bottom;
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
		const availableWidth = window.innerWidth - this._margin.left - this._margin.right;
		const width = (this.width < availableWidth ? this.width : availableWidth);
		return width;
	}

	_handleBodyFocus(e) {
		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		const target = e.composedPath()[0];
		if (isComposedAncestor(dialog, target)) return;
		this._focusFirst();
	}

	_handleClose() {
		/* reset state if native dialog closes unexpectedly. ex. user highlights
		text and then hits escape key - this is not caught by our key handler */
		this._removeHandlers();
		this._focusOpener();
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

	_handleTrapEndFocusIn(e) {
		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		if (isComposedAncestor(dialog, e.relatedTarget)) {
			// user is exiting dialog via forward tabbing...
			const firstFocusable = getNextFocusable(dialog.querySelector('.d2l-dialog-trap-start'));
			if (firstFocusable) {
				firstFocusable.focus();
				return;
			}
		}
		this._focusFirst();
	}

	_handleTrapStartFocusIn(e) {
		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		if (isComposedAncestor(dialog, e.relatedTarget)) {
			// user is exiting dialog via back tabbing...
			const lastFocusable = getPreviousFocusable(dialog.querySelector('.d2l-dialog-trap-end'));
			if (lastFocusable) {
				lastFocusable.focus();
				return;
			}
		}
		this._focusFirst();
	}

	_open() {
		if (!this.opened) return;

		this._opener = getComposedActiveElement();

		this._addHandlers();

		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');
		if (this._hasNativeDialog) {
			dialog.showModal();
		}

		this._updateSize();

		requestAnimationFrame(() => {
			this._state = 'showing';
			this._focusFirst();
		});

	}

	_removeHandlers() {
		window.removeEventListener('resize', this._updateSize);
		document.body.removeEventListener('focus', this._handleBodyFocus, true);
		this.shadowRoot.querySelector('.d2l-dialog-content').removeEventListener('scroll', this._updateOverflow);
	}

	_render(labelId, descriptionId, inner) {

		const styles = {};
		if (this._height) styles.height = `${this._height}px`;
		if (this._width) styles.width = `${this._width}px`;
		else styles.width = 'auto';

		inner = html`
			<span
				class="d2l-dialog-trap-start"
				@focusin="${this._handleTrapStartFocusIn}"
				tabindex="0"></span>
			${inner}
			<span
				class="d2l-dialog-trap-end"
				@focusin="${this._handleTrapEndFocusIn}"
				tabindex="0"></span>
		`;

		return html`${this._hasNativeDialog ?
			html`<dialog
				aria-describedby="${ifDefined(descriptionId)}"
				aria-labelledby="${labelId}"
				class="d2l-dialog-outer"
				@close="${this._handleClose}"
				@keydown="${this._handleKeyDown}"
				?overflow-bottom="${this._overflowBottom}"
				?overflow-top="${this._overflowTop}"
				style=${styleMap(styles)}>
					${inner}
				</dialog>` :
			html`<div
				aria-describedby="${ifDefined(descriptionId)}"
				aria-labelledby="${labelId}"
				class="d2l-dialog-outer"
				@keydown="${this._handleKeyDown}"
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
