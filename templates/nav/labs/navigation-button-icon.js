import '../../../components/colors/colors.js';
import '../../../components/icons/icon.js';
import '../../../components/tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { highlightBorderStyles, highlightButtonStyles } from './navigation-styles.js';
import { FocusMixin } from '../../../mixins/focus-mixin.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Navigation button with an icon and text.
 */
class NavigationButtonIcon extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Disables the button
			 * @type {boolean}
			 */
			disabled: { reflect: true, type: Boolean },
			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String },
			/**
			 * Position of the icon.
			 * @type {'start'|'end'}
			 */
			iconPosition: { attribute: 'icon-position', type: String },
			/**
			 * Visually hides the highlight border when hovered/focused
			 * @type {boolean}
			 */
			noHighlightBorder: { attribute: 'no-highlight-border', type: Boolean },
			/**
			 * REQUIRED: Text for the button
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * Visually hides the text but still accessible
			 * @type {boolean}
			 */
			textHidden: { attribute: 'text-hidden', type: Boolean },
			/**
			 * Offset of the tooltip
			 * @type {Number}
			 */
			tooltipOffset: { attribute: 'tooltip-offset', type: Number },
			/**
			 * Position of the tooltip
			 * @type {'top'|'bottom'|'left'|'right'}
			 */
			tooltipPosition: { attribute: 'tooltip-position', type: String }
		};
	}

	static get styles() {
		return [highlightBorderStyles, highlightButtonStyles, css`
			:host {
				display: inline-block;
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this.iconPosition = 'start';
		this.noHighlightBorder = false;
		this.textHidden = false;
		this._buttonId = getUniqueId();
		this.tooltipPosition = 'bottom';
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const { ariaLabel, id, text, tooltip } = this._getRenderSettings();
		const highlightBorder = (!this.disabled && !this.noHighlightBorder) ? html`<span class="d2l-labs-navigation-highlight-border"></span>` : nothing;
		const icon = html`<d2l-icon icon="${this.icon}"></d2l-icon>`;
		return html`
			<button id="${ifDefined(id)}" ?disabled="${this.disabled}" aria-label="${ifDefined(ariaLabel)}" type="button">
				${highlightBorder}
				${this.iconPosition === 'start' ? icon : nothing}
				${text}
				${this.iconPosition === 'end' ? icon : nothing}
			</button>
			${tooltip}
		`;
	}

	_getRenderSettings() {
		if (this.textHidden) {
			return {
				ariaLabel: this.text,
				id: this._buttonId,
				text: nothing,
				tooltip: html`<d2l-tooltip close-on-click for="${this._buttonId}" for-type="label" position="${this.tooltipPosition}" offset="${ifDefined(this.tooltipOffset)}" class="vdiff-target">${this.text}</d2l-tooltip>`
			};
		}
		return {
			ariaLabel: undefined,
			id: undefined,
			text: this.text,
			tooltip: nothing
		};
	}

}

customElements.define('d2l-labs-navigation-button-icon', NavigationButtonIcon);
