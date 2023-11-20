import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends FocusMixin(LocalizeCoreElement(LitElement)) {
	static get properties() {
		return {
			/**
			 * The text to be shown in the tooltip as a hint when visible-text is false
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * The text to show in the button when visible-text is true
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * When true, show the button with icon and visible text. When false, only show icon.
			 * @type {boolean}
			 */
			visibleText: { type: Boolean, attribute: 'visible-text' }
		};
	}

	static get styles() {
		return [labelStyles, css`
			:host {
				--d2l-button-add-line-style: solid;
			}
			button {
				align-items: center;
				background-color: transparent;
				border: 0;
				box-shadow: none;
				display: flex;
				font-family: inherit;
				justify-content: center;
				outline: none;
				padding: 0;
				position: relative;
				white-space: nowrap;
				width: 100%;
			}

			.line {
				border-top: 1px var(--d2l-button-add-line-style) var(--d2l-color-mica);
				margin: 3px 0;
				width: 100%;
			}
			button:hover .line,
			button:focus .line {
				border-top-color: var(--d2l-color-celestine);
			}

			.content {
				background-color: white;
				padding: 3px;
				position: absolute;
				align-items: center;
				display: flex;
			}
			:host([visible-text]) .content {
				color: var(--d2l-color-celestine);
				height: 1.5rem;
				padding: 0 0.6rem;
			}

			:host([visible-text]) d2l-icon,
			:host(:not([visible-text])) button:hover d2l-icon,
			:host(:not([visible-text])) button:focus d2l-icon {
				color: var(--d2l-color-celestine);
			}
			:host(:not([visible-text])) d2l-icon {
				color: var(--d2l-color-galena);
			}
			:host([visible-text]) d2l-icon {
				padding-right: 0.2rem;
			}
		`];
	}

	constructor() {
		super();

		this.visibleText = false;
		this._buttonId = getUniqueId();

		this.addEventListener('click', this._onClick);
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const text = this.text || this.localize('components.button-add.addItem');
		const label = this.label || this.localize('components.button-add.addItem');

		return html`
			<button class="d2l-label-text" id="${this._buttonId}">
				<div class="line"></div>
				<div class="content">
					<d2l-icon icon="tier1:plus-default"></d2l-icon>
					${this.visibleText
		? html`<span>${text}</span>`
		: html`<d2l-tooltip class="vdiff-target" offset="18" for="${this._buttonId}" for-type="label">${label}</d2l-tooltip>`}
				</div>
			</button>
		`;
	}

	_onClick() {
		/** Dispatched when click happens */
		this.dispatchEvent(new CustomEvent('d2l-button-add-click', {
			bubbles: true,
			composed: true
		}));
	}
}
customElements.define('d2l-button-add', ButtonAdd);

