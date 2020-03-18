import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Tooltip extends RtlMixin(LitElement) {

	static get properties() {
		return {
			delay: { type: Number },
			disableFocusLock: { type: Boolean, attribute: 'disable-focus-lock' },
			for: { type: String },
			forceShow: { type: Boolean, attribute: 'force-show' },
			showing: { type: Boolean, reflect: true },
			state: { type: String, reflect: true }, /* Valid values are: 'info' and 'error' */
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				--d2l-tooltip-background-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
				background-color: var(--d2l-tooltip-background-color);
				box-sizing: border-box;
				color: white;
				display: none;
				position: absolute;
				text-align: left;
				white-space: normal;
				z-index: 1000; /* position on top of floating buttons */
			}

			:host([state="error"]) {
				--d2l-tooltip-background-color: var(--d2l-color-cinnabar);
			}

			:host([dir="rtl"]) {
				text-align: right;
			}

			:host([showing]) {
				display: inline-block;
			}
		`];
	}

	constructor() {
		super();

		this._onTargetMouseEnter = this._onTargetMouseEnter.bind(this);
		this._onTargetMouseLeave = this._onTargetMouseLeave.bind(this);
		this._onTargetFocus = this._onTargetFocus.bind(this);
		this._onTargetBlur = this._onTargetBlur.bind(this);

		this.delay = 0;
		this.disableFocusLock = false;
		this.forceShow = false;
		this.showing = false;
		this.state = 'info';

		this._isFocusing = false;
		this._isHovering = false;
		this._dismissibleId = null;
	}

	get showing() {
		return this._showing;
	}
	set showing(val) {
		const oldVal = this._showing;
		if (oldVal !== val) {
			this._showing = val;
			this.requestUpdate('showing', oldVal);
			this._showingChanged(val);
		}
	}

	connectedCallback() {
		super.connectedCallback();

		requestAnimationFrame(() => {
			this._updateTarget();
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeListeners();
		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;
	}

	hide() {
		this._isHovering = false;
		this._isFocusing = false;
		this._updateShowing();
	}

	render() {
		return html`
			<slot>
			</slot>`
		;
	}

	show() {
		this.showing = true;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				this._updateTarget();
			} else if (prop === 'forceShow') {
				this._updateShowing();
			}
		});
	}

	_addListeners() {
		if (!this._target) {
			return;
		}
		this._target.addEventListener('mouseenter', this._onTargetMouseEnter);
		this._target.addEventListener('mouseleave', this._onTargetMouseLeave);
		this._target.addEventListener('focus', this._onTargetFocus);
		this._target.addEventListener('blur', this._onTargetBlur);
	}

	_findTarget() {
		const ownerRoot = this.getRootNode();

		let target;
		if (this.for) {
			const targetSelector = `#${this.for}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else {
			const parentNode = this.parentNode;
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	_onTargetBlur() {
		this._isFocusing = false;
		this._updateShowing();
	}

	_onTargetFocus() {
		if (this.disableFocusLock) {
			this.showing = true;
		} else {
			this._isFocusing = true;
			this._updateShowing();
		}
	}

	_onTargetMouseEnter() {
		this._hoverTimeout = setTimeout(() => {
			this._isHovering = true;
			this._updateShowing();
		}, this.delay);
	}

	_onTargetMouseLeave() {
		clearTimeout(this._hoverTimeout);
		this._isHovering = false;
		this._updateShowing();
	}

	_removeListeners() {
		if (!this._target) {
			return;
		}
		this._target.removeEventListener('mouseenter', this._onTargetMouseEnter);
		this._target.removeEventListener('mouseleave', this._onTargetMouseLeave);
		this._target.removeEventListener('focus', this._onTargetFocus);
		this._target.removeEventListener('blur', this._onTargetBlur);
	}

	async _showingChanged(newValue) {
		clearTimeout(this._hoverTimeout);
		if (newValue) {
			await this.updateComplete;

			// TODO: Perform layout

			this._dismissibleId = setDismissible(() => this.hide());
			this.dispatchEvent(new CustomEvent(
				'd2l-tooltip-show', { bubbles: true, composed: true }
			));
		} else {
			if (this._dismissibleId) {
				clearDismissible(this._dismissibleId);
				this._dismissibleId = null;
			}
			this.dispatchEvent(new CustomEvent(
				'd2l-tooltip-hide', { bubbles: true, composed: true }
			));
		}
	}

	_updateShowing() {
		this.showing = this._isFocusing || this._isHovering || this.forceShow;
	}

	_updateTarget() {
		this._removeListeners();
		const target = this._findTarget();
		if (target) {
			this.id = this.id || getUniqueId();
			target.setAttribute('aria-describedby', this.id);
		}
		this._target = target;
		this._addListeners();

		if (this.showing) {
			// TODO: Perform layout
		}
	}
}
customElements.define('d2l-tooltip', Tooltip);
