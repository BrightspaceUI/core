import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { buttonStyles } from './button-styles.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';

const keyCodes = Object.freeze({
	DOWN: 40,
	END: 35,
	HOME: 36,
	LEFT: 37,
	RIGHT: 39,
	UP: 38
});

export const moveActions = Object.freeze({
	up: 'up',
	down: 'down',
	left: 'left',
	right: 'right',
	rootHome: 'root-home',
	home: 'home',
	rootEnd: 'root-end',
	end: 'end'
});

/**
 * A button component that provides a move action via a single button.
 * @fires d2l-button-move-action - Dispatched when move action occurs
 */
class ButtonMove extends ThemeMixin(FocusMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			autofocus: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: A description to be added to the button for accessibility when text on button does not provide enough context
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * Disables the down interaction
			 * @type {boolean}
			 */
			disabledDown: { type: Boolean, attribute: 'disabled-down', reflect: true },
			/**
			 * Disables the end interaction
			 * @type {boolean}
			 */
			disabledEnd: { type: Boolean, attribute: 'disabled-end', reflect: true },
			/**
			 * Disables the home interaction
			 * @type {boolean}
			 */
			disabledHome: { type: Boolean, attribute: 'disabled-home', reflect: true },
			/**
			 * Disables the left interaction
			 * @type {boolean}
			 */
			disabledLeft: { type: Boolean, attribute: 'disabled-left', reflect: true },
			/**
			 * Disables the right interaction
			 * @type {boolean}
			 */
			disabledRight: { type: Boolean, attribute: 'disabled-right', reflect: true },
			/**
			 * Disables the up interaction
			 * @type {boolean}
			 */
			disabledUp: { type: Boolean, attribute: 'disabled-up', reflect: true },
			/**
			 * ACCESSIBILITY: REQUIRED: Accessible text for the button
			 * @type {string}
			 */
			text: { type: String, reflect: true }

		};
	}

	static get styles() {
		return [ buttonStyles,
			css`
				:host {
					--d2l-button-move-background-color-focus: #ffffff;
					--d2l-button-move-icon-background-color-hover: var(--d2l-color-mica);
					--d2l-button-move-box-shadow-focus: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
					--d2l-icon-fill-color: var(--d2l-color-tungsten);
					display: inline-block;
					line-height: 0;
				}
				:host([hidden]) {
					display: none;
				}
				:host([theme="dark"]) {
					--d2l-button-move-background-color-focus: #000000;
					--d2l-button-move-icon-background-color-hover: rgba(51, 53, 54, 0.9); /* tungsten @70% @90% */
					--d2l-button-move-box-shadow-focus: 0 0 0 2px black, 0 0 0 4px var(--d2l-color-celestine-plus-1);
					--d2l-icon-fill-color: var(--d2l-color-sylvite);
				}
				button {
					background-color: transparent;
					display: flex;
					flex-direction: column;
					gap: 2px;
					margin: 0;
					min-height: 1.8rem;
					padding: 0;
					position: relative;
					width: 0.9rem;
				}
				d2l-icon {
					border-radius: 0.1rem;
					height: 0.85rem;
					width: 0.9rem;
				}
				button:focus {
					background-color: var(--d2l-button-move-background-color-focus);
				}
				button:hover > d2l-icon,
				button:focus > d2l-icon {
					background-color: var(--d2l-button-move-icon-background-color-hover);
				}
				button:${unsafeCSS(getFocusPseudoClass())} {
					box-shadow: var(--d2l-button-move-box-shadow-focus);
				}
				.up-icon {
					border-top-left-radius: 0.3rem;
					border-top-right-radius: 0.3rem;
				}
				.down-icon {
					border-bottom-left-radius: 0.3rem;
					border-bottom-right-radius: 0.3rem;
				}

				.up-layer,
				.down-layer {
					height: 1.1rem;
					left: -0.2rem;
					position: absolute;
					width: 1.3rem;
				}
				.up-layer {
					top: -0.25rem;
				}
				.down-layer {
					bottom: -0.25rem;
				}
				:host([dir="rtl"]) .up-layer,
				:host([dir="rtl"]) .down-layer {
					left: auto;
					right: -0.2rem;
				}

				/* Firefox includes a hidden border which messes up button dimensions */
				button::-moz-focus-inner {
					border: 0;
				}
				button[disabled]:hover > d2l-icon {
					background-color: transparent;
				}
				:host([disabled-up]) .up-icon,
				:host([disabled-down]) .down-icon {
					opacity: 0.5;
				}
				:host([disabled-up]) .up-layer,
				:host([disabled-down]) .down-layer {
					cursor: default;
				}
			`
		];
	}

	constructor() {
		super();
		/** @ignore */
		this.autofocus = false;
		/** @internal */
		this._buttonId = getUniqueId();
		/** @internal */
		this._describedById = getUniqueId();
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		return html`
			<div role="application">
				<button
					aria-describedby="${ifDefined(this.description ? this._describedById : undefined)}"
					aria-label="${ifDefined(this.text)}"
					?autofocus="${this.autofocus}"
					?disabled="${this.disabledUp && this.disabledDown && this.disabledLeft && this.disabledRight && this.disabledHome && this.disabledEnd}"
					id="${this._buttonId}"
					@keydown="${this._handleKeydown}"
					title="${ifDefined(this.text)}"
					type="button">
					<d2l-icon icon="tier1:arrow-toggle-up" class="up-icon"></d2l-icon>
					<d2l-icon icon="tier1:arrow-toggle-down" class="down-icon"></d2l-icon>
					<div class="up-layer" @click="${this._handleUpClick}"></div>
					<div class="down-layer" @click="${this._handleDownClick}"></div>
			</button>
			${this.description ? html`<span id="${this._describedById}" hidden>${this.description}</span>` : null}
		</div>`;
	}

	_dispatchAction(action) {
		if (!action) return;
		this.dispatchEvent(new CustomEvent('d2l-button-move-action', {
			detail: { action },
			bubbles: false
		}));
	}

	_handleDownClick() {
		if (this.disabledDown) return;
		this._dispatchAction(moveActions.down);
	}

	_handleKeydown(e) {

		let action;
		switch (e.keyCode) {
			case keyCodes.UP:
				if (!this.disabledUp) action = moveActions.up;
				break;
			case keyCodes.DOWN:
				if (!this.disabledDown) action = moveActions.down;
				break;
			case keyCodes.LEFT:
				if (!this.disabledLeft) action = moveActions.left;
				break;
			case keyCodes.RIGHT:
				if (!this.disabledRight) action = moveActions.right;
				break;
			case keyCodes.HOME:
				if (!this.disabledHome) action = (e.ctrlKey ? moveActions.rootHome : moveActions.home);
				break;
			case keyCodes.END:
				if (!this.disabledEnd) action = (e.ctrlKey ? moveActions.rootEnd : moveActions.end);
				break;
			default:
				return;
		}

		if (action) this._dispatchAction(action);
		e.preventDefault();
		e.stopPropagation();

	}

	_handleUpClick() {
		if (this.disabledUp) return;
		this._dispatchAction(moveActions.up);
	}

}

customElements.define('d2l-button-move', ButtonMove);
