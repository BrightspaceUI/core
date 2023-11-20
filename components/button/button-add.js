import '../tooltip/tooltip.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component for quickly adding items to a specific locaiton.
 * TODO:
 * - smarter margin and padding and top
 * - focus
 * - simplify html and css
 */
class ButtonAdd extends LocalizeCoreElement(LitElement) {
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
				background-color: transparent;
				border: 0;
				font-family: inherit;
				display: flex;
				justify-content: center;
				outline: none;
				padding: 0;
				position: relative;
				width: 100%;
			}
			.line {
				border-top: 1px var(--d2l-button-add-line-style) var(--d2l-color-mica);
				margin: 3px 0;
				width: 100%;
			}
			:host(:hover) .line,
			button:focus .line {
				border-top-color: var(--d2l-color-celestine);
			}
			button:focus d2l-icon {
				color: var(--d2l-color-celestine);
			}
			d2l-icon.icon-no-text {
				background-color: white;
				color: var(--d2l-color-mica);
				padding: 3px;
				position: absolute;
				top: -8px;
			}
			:host(:hover) d2l-icon {
				color: var(--d2l-color-celestine);
			}
			.icon-text {
				align-items: center;
				background-color: white;
				color: var(--d2l-color-celestine);
				display: flex;
				height: 30px;
				padding: 0 0.6rem;
				position: absolute;
				top: -11px;
			}
			.icon-text d2l-icon {
				color: var(--d2l-color-celestine);
				padding-right: 3px;
			}
		`];
	}

	constructor() {
		super();

		this.visibleText = false;
		this._iconId = getUniqueId();

		this.addEventListener('click', this._onClick);
	}

	render() {
		const text = this.text || this.localize('components.button-add.addItem');
		const label = this.label || this.localize('components.button-add.addItem');
		return html`
			<button class="d2l-label-text" aria-label="Add Button">
				<div class="line"></div>
				${this.visibleText
					? html`
						<div class="icon-text">
							<d2l-icon icon="tier1:plus-default"></d2l-icon>
							<span>${text}</span>
						</div>`
					: html`
						<d2l-icon icon="tier1:plus-default"  class="icon-no-text"></d2l-icon>
						<d2l-tooltip class="vdiff-target" offset="15">${label}</d2l-tooltip>
					`
				}
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

