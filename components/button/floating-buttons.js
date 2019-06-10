import 'lit-media-query/lit-media-query.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { labelStyles } from '../typography/styles.js';

class FloatingButtons extends ButtonMixin(LitElement) {
	static get properties() {
		return {
			/**
			 * Whether always enable floating buttons. Note: by default, buttons may not float depending on
			 * space available since floating buttons may result in poor user experience when view-port is small
			 * (ex. phones).
			 */
			alwaysFloat: {
				reflect: true,
				type: Boolean,
				attribute: 'always-float'
			},

			/**
			 * Minimum height of view-port in order for buttons to float.
			 */
			minHeight: {
				reflect: true,
				type: String,
				attribute: 'min-height'
			},

			_viewportIsAtLeastMinHeight: {
				reflect: true,
				type: Boolean
			}
		};
	}

	static get styles() {
		return [ labelStyles, buttonStyles,
			css`
			:host {
				box-sizing: border-box;
				display: block;
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
				position: fixed;
				right: 0;
				z-index: 999;
			}
			.d2l-floating-buttons-container > div {
				padding: 0.75rem 0 0 0;
				position: relative;
			}
			.d2l-floating-buttons-container > div {
				padding: 0.75rem 0 0 0;
				position: relative;
			}
			.d2l-floating-buttons-inner-container ::slotted(d2l-button),
			.d2l-floating-buttons-inner-container ::slotted(button),
			.d2l-floating-buttons-inner-container ::slotted(.d2l-button) {
				margin-right: var(--d2l-button-spacing) !important;
				margin-bottom: var(--d2l-button-spacing) !important;
			}
			:host-context([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(d2l-button),
			:host-context([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(button),
			:host-context([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(.d2l-button) {
				margin-left: var(--d2l-button-spacing) !important;
				margin-right: 0 !important;
			}
			@keyframes d2l-floating-buttons-animation {
				0% {
					border-color: transparent;
					background-color: transparent;
					transform: translate(0,10px);
				}
				100% {
					border-top-color: var(--d2l-color-mica);
					background-color: rgba(255, 255, 255, 0.88);
					transform: translate(0,0);
				}
			}
			@-webkit-keyframes d2l-floating-buttons-animation {
				0% {
					border-color: transparent;
					background-color: transparent;
					-webkit-transform: translate(0,10px);
				}
				100% {
					border-top-color: var(--d2l-color-mica);
					background-color: rgba(255, 255, 255, 0.88);
					-webkit-transform: translate(0,0);
				}
			}
			`
		];
	}

	constructor() {
		super();
		this._container = null;
		this._isRTL = false;
		this._spacer = null;
		this.minHeight = '500px';
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this._reposition);
		window.removeEventListener('scroll', this._reposition);
	}

	render() {
		return html`
			<lit-media-query
  				.query="(max-height: ${this.minHeight})"
  				@changed="${this._handleMediaQuery}">
			</lit-media-query>
			<div class="d2l-floating-buttons-container">
				<div class="d2l-floating-buttons-inner-container">
					<slot></slot>
				</div>
			</div>
			<div class="d2l-floating-buttons-spacer"></div>
		`;
	}

	firstUpdated() {
		this._reposition = this._reposition.bind(this);
		this.updateComplete.then(() => {

			this._container = this.shadowRoot.querySelector('.d2l-floating-buttons-container');
			this._spacer = this.shadowRoot.querySelector('.d2l-floating-buttons-spacer');

			window.addEventListener('resize', this._reposition);
			window.addEventListener('scroll', this._reposition);

			this._isRTL = (getComputedStyle(this._container).direction === 'rtl');
			this.updateComplete.then(() => {
				this._reposition();
				let prevDocumentHeight = document.body.offsetHeight;
				setInterval(() => {
					const documentHeight = document.body.offsetHeight;
					if (prevDocumentHeight !== documentHeight) {
						this._reposition();
					}
					prevDocumentHeight = documentHeight;
				}, 100);
			});
		});
	}

	/**
	 * Whether or not the buttons are floating.
	 */
	isFloating() {
		return this._container.classList.contains('d2l-floating-buttons-floating');
	}

	_reposition() {
		const containerRect = this._container.getBoundingClientRect();
		this._spacer.style.height = `${containerRect.height}px`;

		const spacerRect = this._spacer.getBoundingClientRect();

		let containerTop;
		const bodyScrollTop = document.body.scrollTop;
		const isFloating = this._container.classList.contains('d2l-floating-buttons-floating');

		if (isFloating) {
			containerTop = spacerRect.top + bodyScrollTop;
		} else {
			containerTop = containerRect.top + bodyScrollTop;
		}

		const viewBottom = bodyScrollTop + window.innerHeight;
		const innerContainer = this._container.querySelector('div');

		if (!this.alwaysFloat &&
			(this._viewportIsAtLeastMinHeight || ((containerTop + containerRect.height) <= viewBottom))) {

			if (!isFloating) {
				return;
			}

			this._container.classList.remove('d2l-floating-buttons-floating');
			if (!this._isRTL) {
				innerContainer.style.left = `${0}px`;
			} else {
				innerContainer.style.right = `${0}px`;
			}

			this._spacer.style.display = 'none';
			innerContainer.style.width = 'auto';

		} else {

			this._container.classList.add('d2l-floating-buttons-floating');
			this._spacer.style.display = 'block';

			const updateWithRect = isFloating ? spacerRect : containerRect;
			if (!this._isRTL) {
				if (Math.abs(innerContainer.style.left.replace('px', '') - updateWithRect.left) > 1) {
					innerContainer.style.left = `${updateWithRect.left}px`;
				}
			} else {
				if (Math.abs(innerContainer.style.right.replace('px', '') - updateWithRect.left) > 1) {
					innerContainer.style.right = `${updateWithRect.left}px`;
				}
			}
			if (Math.abs(innerContainer.style.width.replace('px', '') - updateWithRect.width) > 1) {
				innerContainer.style.width = `${updateWithRect.width}px`;
			}
		}
	}

	_handleMediaQuery(event) {
		this._viewportIsAtLeastMinHeight = event.detail.value;
	}
}
customElements.define('d2l-floating-buttons', FloatingButtons);
