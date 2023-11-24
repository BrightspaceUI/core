import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor/visible-on-ancestor-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const HINT_TIMING = {
	ALWAYS: 'always',
	NEARBY: 'nearby',
	NEVER: 'never'
};
const DEFAULT_HINT_DISTANCE = 37;

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends PropertyRequiredMixin(FocusMixin(LocalizeCoreElement(LitElement))) {
	static get properties() {
		return {
			/**
			 * ONLY when visible-text is FALSE and hint-timing is nearby
			 * Distance in px where when the user is hovering within that distance the icon will appears. Default is 37.
			 * @type {number}
			 */
			hintNearbyDistance: { type: Number, reflect: true, attribute: 'hint-nearby-distance' },
			/**
			 * ONLY when visible-text is FALSE
			 * When to show the icon/icon text. Always - always visible, Nearby - when mouse within certain distance, Never - do not show until hover/focus.
			 * @type {'always'|'nearby'|'never'}
			 */
			hintTiming: { type: String, reflect: true, attribute: 'hint-timing' },
			/**
			 * When text-visible is true, the text to show in the button. When text-visible is false, the text to show in the tooltip.
			 * @type {string}
			 */
			text: { type: String, required: true },
			/**
			 * When true, show the button with icon and visible text. When false, only show icon.
			 * @type {boolean}
			 */
			textVisible: { type: Boolean, reflect: true, attribute: 'text-visible' },
			_hasFocus: { state: true }
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
			button:${unsafeCSS(getFocusPseudoClass())} .line {
				border-top-color: var(--d2l-color-celestine);
			}
		`;
	}

	constructor() {
		super();

		this.hintTiming = HINT_TIMING.ALWAYS;
		this.textVisible = false;

		this._buttonId = getUniqueId();
		this._hasFocus = false;
		this._visibleDistance = 0;

		this.addEventListener('focus', this._onFocusHover);
		this.addEventListener('mouseover', this._onFocusHover);
		this.addEventListener('blur', this._onBlur);
		this.addEventListener('mouseout', this._onBlur);
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const buttonSpacing = this._getButtonSpacing();
		const text = this.text || this.localize('components.button-add.addItem');
		const content = this.textVisible ? this._renderWithTextVisible(text) : this._renderWithTextHidden(text);
		const id = !this.textVisible ? this._buttonId : undefined;

		return html`
			<button class="d2l-label-text d2l-visible-on-ancestor-target" id="${ifDefined(id)}" style="${styleMap(buttonSpacing)}">
				<div class="line"></div>
				${content}
			</button>
		`;
	}

	_getButtonSpacing() {
		if (this.textVisible || this.hintTiming !== HINT_TIMING.NEARBY) return {};

		this._visibleDistance = this.hintNearbyDistance || DEFAULT_HINT_DISTANCE;
		return {
			marginBottom: `-${this._visibleDistance}px`,
			marginTop: `-${this._visibleDistance}px`,
			paddingBottom: `${this._visibleDistance}px`,
			paddingTop: `${this._visibleDistance}px`
		};
	}

	_onBlur() {
		this._hasFocus = false;
	}
	_onFocusHover() {
		this._hasFocus = true;
	}

	_renderWithTextHidden(text) {
		if (this.textVisible) return this._renderWithTextVisible();

		const visibleOnAncestor = this.hintTiming === HINT_TIMING.NEARBY || this.hintTiming === HINT_TIMING.NEVER;
		const offset = -(this._visibleDistance - 18);

		return html`
			<d2l-button-add-icon-text
				?show-focus="${this._hasFocus}"
				?visible-on-ancestor="${visibleOnAncestor}"
			></d2l-button-add-icon-text>
			<d2l-tooltip class="vdiff-target" offset="${offset}" for="${this._buttonId}" for-type="label">${text}</d2l-tooltip>
		`;
	}

	_renderWithTextVisible(text) {
		if (!this.textVisible) return this._renderWithTextHidden();

		return html`
			<d2l-button-add-icon-text
				text="${text}"
				?show-focus="${this._hasFocus}"
			></d2l-button-add-icon-text>
		`;
	}

}
customElements.define('d2l-button-add', ButtonAdd);

/**
 * @ignore
 */
class ButtonAddIconText extends VisibleOnAncestorMixin(LitElement) {
	static get properties() {
		return {
			text: { type: String },
			showFocus: { type: Boolean, reflect: true, attribute: 'show-focus' }
		};
	}

	static get styles() {
		return [visibleOnAncestorStyles, css`
			:host {
				align-items: center;
				background-color: white;
				display: flex;
				position: absolute;
			}
			:host([text]) {
				color: var(--d2l-color-celestine);
				height: 1.5rem;
				padding: 0 0.3rem;
			}

			:host([text]) d2l-icon,
			:host([show-focus]:not([text])) d2l-icon {
				color: var(--d2l-color-celestine);
			}
			:host(:not([text])) d2l-icon {
				color: var(--d2l-color-galena);
				margin: -3px; /** hover/click target */
				padding: 3px; /** hover/click target */
			}
			:host([text]) d2l-icon {
				padding-inline-end: 0.2rem;
			}

			span {
				font-size: 0.7rem;
				font-weight: 700;
				letter-spacing: 0.2px;
				line-height: 1rem;
			}`
		];
	}

	render() {
		return html`
			<d2l-icon icon="tier1:plus-default"></d2l-icon>
			${this.text ? html`<span class="d2l-label-text">${this.text}</span>` : nothing}
		`;
	}
}
customElements.define('d2l-button-add-icon-text', ButtonAddIconText);
