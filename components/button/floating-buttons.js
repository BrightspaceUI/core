import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class FloatingButtons extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/* Whether always enable floating buttons. Note: by default, buttons may not float depending on
			* space available since floating buttons may result in poor user experience when view-port is small
			* (ex. phones).
			*/
			alwaysFloat: {
				type: Boolean,
				attribute: 'always-float',
				reflect: true
			},

			minHeight: {
				type: String,
				attribute: 'min-height'
			},

			_containerMarginLeft: {
				type: Object
			},

			_containerMarginRight: {
				type: Object
			},

			_floatingButtonsFloating: {
				type: Boolean
			},

			_innerContainerLeft: {
				type: Number
			},

			_innerContainerRight: {
				type: Number
			}
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: inline;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-floating-buttons-container {
				border-top: 1px solid transparent;
				display: block;
				overflow-x: hidden;
			}

			.d2l-floating-buttons-container.d2l-floating-buttons-floating {
				background-color: #ffffff;
				background-color: rgba(255, 255, 255, 0.88);
				border-top-color: var(--d2l-color-mica);
				bottom: -10px;
				box-shadow: 0 -2px 4px rgba(86, 90, 92, .2);
				left: 0;
				position: sticky;
				right: 0;
				transform: translate(0, -10px);
				transition: transform 500ms, border-top-color 500ms, background-color 500ms;
				z-index: 999;
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
		this._container = null;
		this._containerTop = null;

		this._calcIfFloating = this._calcIfFloating.bind(this);
		this._calcContainerPosition = this._calcContainerPosition.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('scroll', this._calcContainerPosition);
		window.addEventListener('resize', this._calcContainerPosition);
		window.addEventListener('d2l-tab-panel-selected', this._calcContainerPosition);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('scroll', this._calcContainerPosition);
		window.removeEventListener('resize', this._calcContainerPosition);
		window.removeEventListener('d2l-tab-panel-selected', this._calcContainerPosition);
	}

	firstUpdated() {
		super.firstUpdated();

		this._container = this.shadowRoot.querySelector('.d2l-floating-buttons-container');
		this._containerTop = this.shadowRoot.querySelector('.d2l-floating-detection');

		this._calcContainerPosition();
	}

	updated(changedProperties) {
		super.updated();
		changedProperties.forEach((oldValue, propName) => {
			if (propName === '_dir') {
				this._calcContainerPosition();
			}
		});
	}

	_calcContainerPosition() {
		this._calcIfFloating();
		if (!this._floatingButtonsFloating) {
			return;
		}

		const offsetParentLeft = this.offsetParent.getBoundingClientRect().left;
		const left = this.getBoundingClientRect().left;
		const containerLeft = left - offsetParentLeft - 1;
		this._containerMarginLeft = `-${containerLeft}px`;

		const offsetParentRight = this.offsetParent.getBoundingClientRect().right;
		const right = this.getBoundingClientRect().right;
		const containerRight = offsetParentRight - right - 1;
		this._containerMarginRight = `-${containerRight}px`;

		if (this.dir !== 'rtl') {
			this._innerContainerLeft = `${containerLeft}px`;
		} else {
			this._innerContainerRight = `${containerLeft}px`;
		}
	}

	_calcIfFloating() {
		if (this.alwaysFloat) {
			this._floatingButtonsFloating = true;
			return;
		}

		let _viewportIsLessThanMinHeight;
		if (this.minHeight) {
			_viewportIsLessThanMinHeight = window.matchMedia(`(max-height: ${this.minHeight})`).matches;
		}

		const viewBottom = window.innerHeight;
		const containerRect = this._container.getBoundingClientRect();
		const containerTop = this._containerTop.getBoundingClientRect().top;

		/* if viewport height is less than minHeight (e.g., mobile device),
		 * or div.d2l-floating-detection is visible (i.e., buttons no longer need to be floating)
		 * then do not float the buttons
		 */
		if (_viewportIsLessThanMinHeight || ((containerTop + containerRect.height) <= viewBottom)) {
			this._floatingButtonsFloating = false;
		} else {
			this._floatingButtonsFloating = true;
		}
	}

	render() {
		const containerClasses = {
			'd2l-floating-buttons-container': true,
			'd2l-floating-buttons-floating': this._floatingButtonsFloating
		};

		const containerStyle = {
			marginLeft: this._containerMarginLeft,
			marginRight: this._containerMarginRight
		};

		const innerContainerStyle = {
			left: this._innerContainerLeft,
			right: this._innerContainerRight
		};

		return html`
			<div class="d2l-floating-detection"></div>
			<div class=${classMap(containerClasses)} style=${styleMap(containerStyle)}>
				<div class="d2l-floating-buttons-inner-container" style=${styleMap(innerContainerStyle)}>
					<slot></slot>
				</div>
			</div>
		`;
	}
}

customElements.define('d2l-floating-buttons', FloatingButtons);
