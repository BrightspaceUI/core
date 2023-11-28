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

const VISIBILITY_CONDITION = {
	ALWAYS: 'always',
	NEARBY: 'nearby',
	HOVER_FOCUS: 'hover-focus'
};
const NEARBY_VISIBILITY_DISTANCE_DEFAULT = 0.55;

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends PropertyRequiredMixin(FocusMixin(LocalizeCoreElement(LitElement))) {
	static get properties() {
		return {
			/**
			 * ONLY used when text-visible is FALSE and visibility-condition is "nearby". Distance in rem where when the user is hovering within that distance the icon will appears. Default is 0.55.
			 * @type {number}
			 */
			nearbyVisibilityDistance: { type: Number, reflect: true, attribute: 'nearby-visibility-distance' },
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
			/**
			 * ONLY used when text-visible is FALSE. When to show the icon/icon text with user interaction. "always" - always visible, "nearby" - when mouse within hint-nearby-distance, "hover-focus" - do not show until hover/focus. Default is "always".
			 * @type {'always'|'nearby'|'hover-focus'}
			 */
			visibilityCondition: { type: String, reflect: true, attribute: 'visibility-condition' },
			_hasFocusOrHover: { state: true }
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
				height: 7px;
				justify-content: center;
				outline: none;
				padding: 0;
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

		this.nearbyVisibilityDistance = NEARBY_VISIBILITY_DISTANCE_DEFAULT;
		this.textVisible = false;
		this.visibilityCondition = VISIBILITY_CONDITION.ALWAYS;

		this._buttonId = getUniqueId();
		this._hasFocusOrHover = false;

		this.addEventListener('focus', this._onFocusMouseOver);
		this.addEventListener('mouseover', this._onFocusMouseOver);
		this.addEventListener('blur', this._onBlurMouseOut);
		this.addEventListener('mouseout', this._onBlurMouseOut);
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const visibleDistance = this.visibilityCondition === VISIBILITY_CONDITION.NEARBY ? (this.nearbyVisibilityDistance || NEARBY_VISIBILITY_DISTANCE_DEFAULT) : 0;
		const buttonSpacing = this._getButtonSpacing(visibleDistance);
		const text = this.text || this.localize('components.button-add.addItem');
		const content = this.textVisible ? this._renderWithTextVisible(text, visibleDistance) : this._renderWithTextHidden(text, visibleDistance);
		const id = !this.textVisible ? this._buttonId : undefined;

		return html`
			<button
				class="d2l-label-text d2l-visible-on-ancestor-target"
				id="${ifDefined(id)}"
				style="${styleMap(buttonSpacing)}"
				type="button">
				<div class="line"></div>
				${content}
				<div class="line"></div>
			</button>
		`;
	}

	_getButtonSpacing(visibleDistance) {
		if (this.textVisible || this.visibilityCondition !== VISIBILITY_CONDITION.NEARBY) return {};
		return {
			marginBottom: `-${visibleDistance}rem`,
			marginTop: `-${visibleDistance}rem`,
			paddingBottom: `${visibleDistance}rem`,
			paddingTop: `${visibleDistance}rem`
		};
	}

	_onBlurMouseOut() {
		this._hasFocusOrHover = false;
	}
	_onFocusMouseOver() {
		this._hasFocusOrHover = true;
	}

	_renderWithTextHidden(text, visibleDistance) {
		const visibleOnAncestor = this.visibilityCondition === VISIBILITY_CONDITION.NEARBY || this.visibilityCondition === VISIBILITY_CONDITION.HOVER_FOCUS;
		const offset = visibleDistance !== 0 ? -(visibleDistance - 18) : 18;
		const styles = {
			position: visibleOnAncestor && !this._hasFocusOrHover ? 'absolute' : 'static'
		};

		return html`
			<d2l-button-add-icon-text
				?show-focus="${this._hasFocusOrHover}"
				?visible-on-ancestor="${visibleOnAncestor}"
				style="${styleMap(styles)}"
			></d2l-button-add-icon-text>
			<d2l-tooltip class="vdiff-target" offset="${offset}" for="${this._buttonId}" for-type="label">${text}</d2l-tooltip>
		`;
	}

	_renderWithTextVisible(text) {
		return html`
			<d2l-button-add-icon-text
				?show-focus="${this._hasFocusOrHover}"
				text="${text}"
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
				display: flex;
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
