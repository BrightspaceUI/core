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

		this._onMouseEnter = this._onMouseEnter.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);
		this._onFocus = this._onFocus.bind(this);
		this._onBlur = this._onBlur.bind(this);

		this.delay = 0;
		this.disableFocusLock = false;
		this.forceShow = false;
		this.showing = false;
		this.state = 'info';

		this._isFocusing = false;
		this._isHovering = false;
		this._dismissibleId = null;
	}

	get for() {
		return this._for;
	}
	set for(val) {
		const oldVal = this._for;
		if (oldVal !== val) {
			this._for = val;
			this.requestUpdate('for', oldVal);
			this._updateTarget();
		}
	}

	get forceShow() {
		return this._forceShow;
	}
	set forceShow(val) {
		const oldVal = this._forceShow;
		if (oldVal !== val) {
			this._forceShow = val;
			this.requestUpdate('force-show', oldVal);
			this._updateShowing();
		}
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
		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;
	}

	render() {

		return html`
			<slot>
			</slot>`
		;
	}

	hide() {
		this._isHovering = false;
		this._isFocusing = false;
		this._updateShowing();
	}

	show() {
		this.showing = true;
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

	_findTarget() {
		const parentNode = this.parentNode;
		const ownerRoot = this.getRootNode();

		let target;
		if (this.for) {
			const targetSelector = `#${this.for}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else {
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	_addListeners() {
		if (!this._target) {
			return;
		}
		this._target.addEventListener('mouseenter', this._onMouseEnter);
		this._target.addEventListener('mouseleave', this._onMouseLeave);
		this._target.addEventListener('focus', this._onFocus);
		this._target.addEventListener('blur', this._onBlur);
	}

	_removeListeners() {
		if (!this._target) {
			return;
		}
		this._target.removeEventListener('mouseenter', this._onMouseEnter);
		this._target.removeEventListener('mouseleave', this._onMouseLeave);
		this._target.removeEventListener('focus', this._onFocus);
		this._target.removeEventListener('blur', this._onBlur);
	}

	_onMouseEnter() {
		this._hoverTimeout = setTimeout(() => {
			this._isHovering = true;
			this._updateShowing();
		}, this.delay);
	}

	_onMouseLeave() {
		clearTimeout(this._hoverTimeout);
		this._isHovering = false;
		this._updateShowing();
	}

	_onFocus() {
		if (this.disableFocusLock) {
			this.showing = true;
		} else {
			this._isFocusing = true;
			this._updateShowing();
		}
	}

	_onBlur() {
		this._isFocusing = false;
		this._updateShowing();
	}

	_updateShowing() {
		this.showing = this._isFocusing || this._isHovering || this.forceShow;
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
}
customElements.define('d2l-tooltip', Tooltip);
