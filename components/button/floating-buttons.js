import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { labelStyles } from '../typography/styles.js';
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

			_floatingButtonsFloating: {
				type: Boolean
			},

			_innerContainerStyle: {
				type: Object
			},

			_buttonSpacerStyle: {
				type: Object
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
				margin: 0 auto;
				width: 100%;
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
		this._buttonSpacerStyle = {};
		this._innerContainerStyle = {};
		this._container = null;
		this._containerTop = null;

		this._reposition = this._reposition.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		if( !this.alwaysFloat ) {
			window.addEventListener('resize', this._reposition);
			window.addEventListener('scroll', this._reposition);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if( !this.alwaysFloat ) {
			window.removeEventListener('resize', this._reposition);
			window.removeEventListener('scroll', this._reposition);
		}
	}

	firstUpdated() {
		super.firstUpdated();
		if( this.alwaysFloat ) {
			this._floatingButtonsFloating = true;
		} else {
			this._container = this.shadowRoot.querySelector('.d2l-floating-buttons-container');
			this._containerTop = this.shadowRoot.querySelector('.d2l-floating-detection');
			this._reposition();
		}
	}

	_reposition() {
		const viewBottom = window.innerHeight;
		const containerRect = this._container.getBoundingClientRect();
		const containerTop = this._containerTop.getBoundingClientRect().top;

		if((containerTop + containerRect.height) <= viewBottom) {
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

		return html`
			<div class="d2l-floating-detection"></div>
			<div class=${classMap(containerClasses)}>
				<div class="d2l-floating-buttons-inner-container" style=${styleMap(this._innerContainerStyle)}>
					<slot></slot>
				</div>
			</div>
		`;
	}
}

customElements.define('d2l-floating-buttons', FloatingButtons);
