import '../focus-trap/focus-trap.js';
import { allowBodyScroll, preventBodyScroll } from '../backdrop/backdrop.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement, getNextFocusable } from '../../helpers/focus.js';
import { classMap} from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { html } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

window.D2L = window.D2L || {};
window.D2L.DialogMixin = window.D2L.DialogMixin || {};

window.D2L.DialogMixin.hasNative = (window.HTMLDialogElement !== undefined);
if (window.D2L.DialogMixin.preferNative === undefined) {
	window.D2L.DialogMixin.preferNative = true;
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const abortAction = 'abort';
const defaultMargin = { top: 100, right: 30, bottom: 30, left: 30 };

export const DialogMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether or not the dialog is open
			 */
			opened: { type: Boolean, reflect: true },

			/**
			 * The optional title for the dialog
			 */
			titleText: { type: String, attribute: 'title-text' },
			_height: { type: Number },
			_left: { type: Number },
			_margin: { type: Object },
			_nestedShowing: { type: Boolean },
			_overflowBottom: { type: Boolean },
			_overflowTop: { type: Boolean },
			_parentDialog: { type: Object },
			_state: { type: String, reflect: true },
			_top: { type: Number },
			_width: { type: Number }
		};
	}

	constructor() {
		super();
		this.opened = false;
		this._dialogId = getUniqueId();
		this._height = 0;
		this._margin = { top: defaultMargin.top, right: defaultMargin.right, bottom: defaultMargin.bottom, left: defaultMargin.left };
		this._parentDialog = null;
		this._nestedShowing = false;
		this._state = null;
		this._left = 0;
		this._overflowBottom = false;
		this._overflowTop = false;
		this._top = 0;
		this._width = 0;
		this._useNative = (window.D2L.DialogMixin.hasNative && window.D2L.DialogMixin.preferNative);
		this._updateSize = this._updateSize.bind(this);
		this._updateOverflow = this._updateOverflow.bind(this);
	}

	async connectedCallback() {
		super.connectedCallback();
		if (!window.ifrauclient) return;
		const ifrauClient = await window.ifrauclient().connect();
		this._ifrauDialogService = await ifrauClient.getService('dialogWC', '0.1');
	}

	async updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('opened')) return;
		if (this.opened) {
			if (this._ifrauDialogService) {
				this._ifrauContextInfo = await this._ifrauDialogService.showBackdrop();
			}
			this._open();
		} else {
			if (this._ifrauDialogService) {
				this._ifrauDialogService.hideBackdrop();
				this._ifrauContextInfo = null;
			}
			this._close();
		}
	}

	open() {
		if (this.opened) return;
		this.opened = true;
		return new Promise((resolve) => {
			const onClose = function(e) {
				if (e.target !== this) return; // ignore if bubbling from child dialog
				this.removeEventListener('d2l-dialog-close', onClose);
				resolve(e.detail.action);
			}.bind(this);
			this.addEventListener('d2l-dialog-close', onClose);
		});
	}

	resize() {
		return this._updateSize();
	}

	_addHandlers() {
		window.addEventListener('resize', this._updateSize);
		this.shadowRoot.querySelector('.d2l-dialog-content').addEventListener('scroll', this._updateOverflow);
	}

	_close(action) {
		if (!this._state) return;
		this._action = action;

		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;

		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');

		const doClose = () => {
			if (this._useNative) dialog.close();
			else this._handleClose();
		};

		if (!reduceMotion) {
			const transitionEnd = () => {
				dialog.removeEventListener('transitionend', transitionEnd);
				doClose();
			};
			dialog.addEventListener('transitionend', transitionEnd);
			this._state = 'hiding';
		} else {
			this._state = 'hiding';
			doClose();
		}
	}

	_focusFirst() {
		const content = this.shadowRoot.querySelector('.d2l-dialog-content');
		if (content) {
			const firstFocusable = getNextFocusable(content);
			if (isComposedAncestor(this.shadowRoot.querySelector('.d2l-dialog-inner'), firstFocusable)) {
				firstFocusable.focus();
				return;
			}
		}
		this.shadowRoot.querySelector('d2l-focus-trap').focus();
	}

	_focusInitial() {
		this._focusFirst();
	}

	async _focusOpener() {
		if (this._opener && this._opener.focus) {
			// wait for inactive focus trap
			requestAnimationFrame(() => {
				this._opener.focus();
				this._opener = null;
			});
		}
	}

	_getHeight() {

		const availableHeight = this._ifrauContextInfo
			? this._ifrauContextInfo.availableHeight - this._margin.top - this._margin.bottom
			: window.innerHeight - this._margin.top - this._margin.bottom;
		let preferredHeight = 0;

		const header = this.shadowRoot.querySelector('.d2l-dialog-header');
		if (header) preferredHeight += header.scrollHeight;

		const contentOuter = this.shadowRoot.querySelector('.d2l-dialog-content');
		const content = this.shadowRoot.querySelector('.d2l-dialog-content > div');

		/* required to properly calculate the preferred height when there are top
		margins at the beginning of slotted content */
		if (contentOuter && content) {
			const offsetDiff = content.offsetTop - contentOuter.offsetTop;
			preferredHeight += content.offsetHeight + offsetDiff;
		}

		const footer = this.shadowRoot.querySelector('.d2l-dialog-footer');
		if (footer) preferredHeight += footer.scrollHeight;

		const height = (preferredHeight < availableHeight ? preferredHeight : availableHeight);
		return height;
	}

	_getLeft() {
		if (this._useNative || !this._parentDialog) return 0;
		const parentRect = this._parentDialog.getBoundingClientRect();
		if (parentRect.width > this._width) return 0;
		return (parentRect.width - this._width) / 2;
	}

	_getWidth() {
		const availableWidth = window.innerWidth - this._margin.left - this._margin.right;
		const width = (this.width < availableWidth ? this.width : availableWidth);
		return width;
	}

	_handleClick(e) {
		// handle "dialog-action" for backwards-compatibility
		if (!e.target.hasAttribute('data-dialog-action') && !e.target.hasAttribute('dialog-action')) return;
		const action = e.target.getAttribute('data-dialog-action') || e.target.getAttribute('dialog-action');
		e.stopPropagation();
		this._close(action);
	}

	_handleClose() {
		/* reset state if native dialog closes unexpectedly. ex. user highlights
		text and then hits escape key - this is not caught by our key handler */
		this._removeHandlers();
		this._focusOpener();
		this._state = null;
		this.opened = false;
		allowBodyScroll(this._bodyScrollKey);
		this._bodyScrollKey = null;
		if (this._action === undefined) this._action = abortAction;
		this.dispatchEvent(new CustomEvent(
			'd2l-dialog-close', {
				bubbles: true,
				composed: true,
				detail: { action: this._action }
			}
		));
	}

	_handleDialogClose(e) {
		this._nestedShowing = false;
		e.stopPropagation();
	}

	_handleDialogOpen(e) {
		this._nestedShowing = true;
		e.stopPropagation();
	}

	_handleFocusTrapEnter() {
		this._focusFirst();
	}

	_handleKeyDown(e) {
		if (!this.opened) return;
		if (e.keyCode === 27) {
			// escape (note: prevent native dialog close so we can: animate it; use setDismissible)
			e.stopPropagation();
			e.preventDefault();
		}
	}

	_open() {
		if (!this.opened) return;

		this._opener = getComposedActiveElement();
		this._dismissibleId = setDismissible(() => {
			if (!this.opened) return;
			this._close(abortAction);
		});

		this._action = undefined;
		this._addHandlers();

		const dialog = this.shadowRoot.querySelector('.d2l-dialog-outer');

		const animPromise = new Promise((resolve) => {
			const transitionEnd = () => {
				dialog.removeEventListener('transitionend', transitionEnd);
				resolve();
			};
			dialog.addEventListener('transitionend', transitionEnd);
		});

		if (this._useNative) {
			dialog.showModal();
		}

		this._parentDialog = findComposedAncestor(this, (node) => {
			return node.classList && node.classList.contains('d2l-dialog-outer');
		});

		// native dialog backdrop does not prevent body scrolling
		this._bodyScrollKey = preventBodyScroll();

		requestAnimationFrame(async() => {
			await this._updateSize();
			this._state = 'showing';
			this._focusInitial();
			if (!reduceMotion) await animPromise;
			this.dispatchEvent(new CustomEvent(
				'd2l-dialog-open', { bubbles: true, composed: true }
			));
		});

	}

	_removeHandlers() {
		window.removeEventListener('resize', this._updateSize);
		this.shadowRoot.querySelector('.d2l-dialog-content').removeEventListener('scroll', this._updateOverflow);
	}

	_render(inner, info) {

		const styles = {};
		if (this._ifrauContextInfo) styles.top = `${this._top}px`;
		if (this._ifrauContextInfo) styles.bottom = 'auto';
		if (this._left) styles.left = `${this._left}px`;
		if (this._height) styles.height = `${this._height}px`;
		if (this._width) styles.width = `${this._width}px`;
		else styles.width = 'auto';

		const dialogOuterClasses = {
			'd2l-dialog-outer': true,
			'd2l-dialog-outer-overflow-bottom': this._overflowBottom,
			'd2l-dialog-outer-overflow-top': this._overflowTop,
			'd2l-dialog-outer-nested': !this._useNative && this._parentDialog,
			'd2l-dialog-outer-nested-showing': !this._useNative && this._nestedShowing
		};

		inner = html`<d2l-focus-trap
			@d2l-focus-trap-enter="${this._handleFocusTrapEnter}"
			?trap="${this.opened}">
				${inner}
			</d2l-focus-trap>`;

		return html`${this._useNative ?
			html`<dialog
				aria-describedby="${ifDefined(info.descId)}"
				aria-labelledby="${info.labelId}"
				class="${classMap(dialogOuterClasses)}"
				@click="${this._handleClick}"
				@close="${this._handleClose}"
				id="${this._dialogId}"
				@keydown="${this._handleKeyDown}"
				role="${info.role}"
				style=${styleMap(styles)}>
					${inner}
				</dialog>` :
			html`<div
				aria-describedby="${ifDefined(info.descId)}"
				aria-labelledby="${info.labelId}"
				class="${classMap(dialogOuterClasses)}"
				@click="${this._handleClick}"
				@d2l-dialog-close="${this._handleDialogClose}"
				@d2l-dialog-open="${this._handleDialogOpen}"
				id="${this._dialogId}"
				role="${info.role}"
				style=${styleMap(styles)}>
					${inner}
				</div>
				<d2l-backdrop for-target="${this._dialogId}" ?shown="${this._state === 'showing'}"></d2l-backdrop>`}
		`;

	}

	_updateOverflow() {
		const content = this.shadowRoot.querySelector('.d2l-dialog-content');
		this._overflowTop = (content.scrollTop > 0);
		this._overflowBottom = (content.scrollHeight > content.scrollTop + content.clientHeight);
	}

	async _updateSize() {
		if (this._ifrauContextInfo) {
			if (this._ifrauContextInfo.top > defaultMargin.top) {
				this._top = 0;
				this._margin.top = 0;
			} else if (this._ifrauContextInfo.top < 0) {
				this._top = defaultMargin.top - this._ifrauContextInfo.top;
				this._margin.top = defaultMargin.top;
			} else {
				this._top = defaultMargin.top - this._ifrauContextInfo.top;
				this._margin.top = defaultMargin.top - this._ifrauContextInfo.top;
			}
		}
		this._width = this._getWidth();
		this._left = this._getLeft();
		await this.updateComplete;
		this._height = this._getHeight();
		await this.updateComplete;
		this._updateOverflow();
		await this.updateComplete;
	}

};
