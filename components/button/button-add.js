import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends FocusMixin(LocalizeCoreElement(LitElement)) {
	static get properties() {
		return {
			/**
			 * When text-visible is true, the text to show in the button. When text-visible is false, the text to show in the tooltip.
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * When true, show the button with icon and visible text. When false, only show icon.
			 * @type {boolean}
			 */
			textVisible: { type: Boolean, reflect: true, attribute: 'text-visible' }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-button-add-line-style: solid;
			}
			button {
				align-items: center;
				background-color: transparent;
				border: 0;
				box-shadow: none;
				cursor: pointer;
				display: flex;
				font-family: inherit;
				justify-content: center;
				outline: none;
				padding: 0;
				position: relative;
				user-select: none;
				white-space: nowrap;
				width: 100%;
			}

			.line {
				border-top: 1px var(--d2l-button-add-line-style) var(--d2l-color-mica);
				margin: 3px 0; /** hover/click target */
				width: 100%;
			}
			button:hover .line,
			button:focus .line {
				border-top-color: var(--d2l-color-celestine);
			}

			.content {
				align-items: center;
				background-color: white;
				display: flex;
				position: absolute;
			}
			:host([text-visible]) .content {
				color: var(--d2l-color-celestine);
				height: 1.5rem;
				padding: 0 0.3rem;
			}

			:host([text-visible]) d2l-icon,
			:host(:not([text-visible])) button:hover d2l-icon,
			:host(:not([text-visible])) button:focus d2l-icon {
				color: var(--d2l-color-celestine);
			}
			:host(:not([text-visible])) d2l-icon {
				color: var(--d2l-color-galena);
				margin: -3px; /** hover/click target */
				padding: 3px; /** hover/click target */
			}
			:host([text-visible]) d2l-icon {
				padding-inline-end: 0.2rem;
			}

			span {
				font-size: 0.7rem;
				font-weight: 700;
				letter-spacing: 0.2px;
				line-height: 1rem;
			}
		`;
	}

	constructor() {
		super();

		this.textVisible = false;
		this._buttonId = getUniqueId();
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const text = this.text || this.localize('components.button-add.addItem');
		const id = !this.textVisible ? this._buttonId : undefined;

		return html`
			<button class="d2l-label-text" id="${ifDefined(id)}">
				<div class="line"></div>
				<div class="content">
					<d2l-icon icon="tier1:plus-default"></d2l-icon>
					${this.textVisible
		? html`<span>${text}</span>`
		: html`<d2l-tooltip class="vdiff-target" offset="18" for="${this._buttonId}" for-type="label">${text}</d2l-tooltip>`}
				</div>
			</button>
		`;
	}
}
customElements.define('d2l-button-add', ButtonAdd);

