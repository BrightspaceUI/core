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
			}

			.d2l-floating-buttons-container.d2l-floating-buttons-floating {
				animation: d2l-floating-buttons-animation 500ms ease-out;
				-webkit-animation: d2l-floating-buttons-animation 500ms ease-out;
				background-color: #ffffff;
				background-color: rgba(255, 255, 255, 0.88);
				border-top-color: var(--d2l-color-mica);
				bottom: 0;
				box-shadow: 0 -2px 4px rgba(86, 90, 92, .2);
				left: 0;
				position: sticky;
				right: 0;
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

			/* fix this */
			@keyframes d2l-floating-buttons-animation {
				0% {
					border-color: transparent;
					background-color: transparent;
					transform: translate(0, 10px);
				}
				100% {
					border-top-color: var(--d2l-color-mica);
					background-color: rgba(255, 255, 255, 0.88);
					transform: translate(0, 0);
				}
			}

			@-webkit-keyframes d2l-floating-buttons-animation {
				0% {
					border-color: transparent;
					background-color: transparent;
					transform: translate(0, 10px);
				}
				100% {
					border-top-color: var(--d2l-color-mica);
					background-color: rgba(255, 255, 255, 0.88);
					transform: translate(0, 0);
				}
			}
		`;
	}

	constructor() {
		super();
		this.minHeight = '500px';
		this._container = null;
		this._containerTop = null;

		this._calcFloating = this._calcFloating.bind(this);
		this._calcSizePosition = this._calcSizePosition.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('resize', this._calcFloating);
		window.addEventListener('resize', this._calcSizePosition);
		window.addEventListener('scroll', this._calcFloating);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this._calcFloating);
		window.removeEventListener('resize', this._calcSizePosition);
		window.removeEventListener('scroll', this._calcFloating);
	}

	firstUpdated() {
		super.firstUpdated();

		this._container = this.shadowRoot.querySelector('.d2l-floating-buttons-container');
		this._containerTop = this.shadowRoot.querySelector('.d2l-floating-detection');
		this._calcFloating();

		this._calcSizePosition();
	}

	updated(changedProperties) {
		super.updated();
		changedProperties.forEach((oldValue, propName) => {
			if (propName === '_dir') {
				this._calcSizePosition();
			}
		});
	}

	_calcFloating() {
		if (this.alwaysFloat) {
			this._floatingButtonsFloating = true;
			return;
		}

		const viewBottom = window.innerHeight;
		const containerRect = this._container.getBoundingClientRect();
		const containerTop = this._containerTop.getBoundingClientRect().top;

		if ((containerTop + containerRect.height) <= viewBottom) {
			this._floatingButtonsFloating = false;
		} else {
			this._floatingButtonsFloating = true;
		}
	}

	_calcSizePosition() {
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
