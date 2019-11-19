import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class FloatingButtons extends RtlMixin(LitElement) {

	static get properties() {
		return {
			alwaysFloat: { type: Boolean, attribute: 'always-float' },
			minHeight: { type: String, attribute: 'min-height' },
			_containerMarginLeft: { type: String },
			_containerMarginRight: { type: String },
			_floating: { type: Boolean, reflect: true },
			_innerContainerLeft: { type: String },
			_innerContainerRight: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: block;
			}

			:host([_floating]) {
				bottom: -10px;
				left: 0;
				position: -webkit-sticky;
				position: sticky;
				right: 0;
				z-index: 999;
			}

			:host([_floating][always-float]) {
				bottom: 0;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-floating-buttons-container {
				border-top: 1px solid transparent;
				display: block;
			}

			:host([_floating]) .d2l-floating-buttons-container {
				background-color: #ffffff;
				background-color: rgba(255, 255, 255, 0.88);
				border-top-color: var(--d2l-color-mica);
				box-shadow: 0 -2px 4px rgba(86, 90, 92, .2);
			}

			:host([_floating]:not([always-float])) .d2l-floating-buttons-container {
				transform: translate(0, -10px);
				transition: transform 500ms, border-top-color 500ms, background-color 500ms;
			}

			.d2l-floating-buttons-container > div {
				padding: 0.75rem 0 0 0;
				position: relative;
			}

			.d2l-floating-buttons-inner-container ::slotted(d2l-button),
			.d2l-floating-buttons-inner-container ::slotted(button),
			.d2l-floating-buttons-inner-container ::slotted(.d2l-button) {
				margin-right: 0.75rem !important;
				margin-bottom: 0.75rem !important;
			}

			.d2l-floating-buttons-inner-container ::slotted(d2l-button-group) {
				padding-bottom: 0.75rem !important;
			}

			:host([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(d2l-button),
			:host([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(button),
			:host([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(.d2l-button) {
				margin-left: 0.75rem !important;
				margin-right: 0 !important;
			}
		`;
	}

	constructor() {
		super();
		this.minHeight = '500px';

		this._calcContainerPosition = this._calcContainerPosition.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('scroll', this._calcContainerPosition);
		window.addEventListener('resize', this._calcContainerPosition);
		window.addEventListener('d2l-dir-update', this._calcContainerPosition);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('scroll', this._calcContainerPosition);
		window.removeEventListener('resize', this._calcContainerPosition);
		window.removeEventListener('d2l-dir-update', this._calcContainerPosition);
		if (this.__resizeObserver) {
			this.__resizeObserver.disconnect();
			this.__resizeObserver = null;
		}
	}

	firstUpdated() {
		super.firstUpdated();

		this._calcContainerPosition();
		this._startObserver();
	}

	_startObserver() {
		this._resizeObserver = this._resizeObserver || new ResizeObserver(entries => {
			for (let i = 0; i < entries.length; i++) {
				this._calcContainerPosition();
			}
		});
		const htmlElem = document.documentElement;
		this._resizeObserver.observe(htmlElem);
	}

	_calcContainerPosition() {
		this._floating = this._shouldFloat();
		if (!this._floating || !this.offsetParent) {
			return;
		}

		const offsetParentBoundingRect = this.offsetParent.getBoundingClientRect();
		const boundingRect = this.getBoundingClientRect();

		const offsetParentLeft = offsetParentBoundingRect.left;
		const left = boundingRect.left;
		const containerLeft = left - offsetParentLeft - 1;
		if (containerLeft !== 0) {
			// only update this if needed - needed for firefox
			this._containerMarginLeft = `-${containerLeft}px`;
		}

		const offsetParentRight = offsetParentBoundingRect.right;
		const right = boundingRect.right;
		const containerRight = offsetParentRight - right - 1;
		if (containerRight !== 0) {
			this._containerMarginRight = `-${containerRight}px`;
		}

		if (this.dir !== 'rtl') {
			if (containerLeft !== 0) {
				this._innerContainerLeft = `${containerLeft}px`;
			}
		} else {
			this._innerContainerRight = `${containerRight}px`;
		}
	}

	_shouldFloat() {
		if (this.alwaysFloat) {
			return true;
		}

		let _viewportIsLessThanMinHeight;
		if (this.minHeight) {
			_viewportIsLessThanMinHeight = window.matchMedia(`(max-height: ${this.minHeight})`).matches;
		}

		const viewBottom = window.innerHeight;
		const containerRectHeight = this.getBoundingClientRect().height;
		const containerTop = this.getBoundingClientRect().top;

		let scrollbarHeightEstimate = 0;
		const hasHorizontalScollbar = document.body.scrollWidth > document.body.clientWidth;
		if (hasHorizontalScollbar) {
			scrollbarHeightEstimate = 17; // needed in case of horizontal scrollbar in Windows
		}

		/* if viewport height is less than minHeight (e.g., mobile device),
		 * or user has scrolled to bottom of page
		 * then do not float the buttons
		 */
		if (_viewportIsLessThanMinHeight || ((containerTop + containerRectHeight + scrollbarHeightEstimate) <= viewBottom)) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		const containerStyle = {
			marginLeft: this._containerMarginLeft,
			marginRight: this._containerMarginRight
		};

		const innerContainerStyle = {
			marginLeft: this._innerContainerLeft,
			marginRight: this._innerContainerRight
		};

		return html`
			<div class="d2l-floating-buttons-container" style=${styleMap(containerStyle)}>
				<div class="d2l-floating-buttons-inner-container" style=${styleMap(innerContainerStyle)}>
					<slot></slot>
				</div>
			</div>
		`;
	}
}

customElements.define('d2l-floating-buttons', FloatingButtons);
