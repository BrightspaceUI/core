import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component used to display additional information when users focus or hover over some text.
 * @slot - Default content placed inside of the tooltip
 */
class TooltipHelp extends SkeletonMixin(FocusMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Allows this component to inherit certain font properties
			 * @type {boolean}
			 */
			inheritFontStyle: { type: Boolean, attribute: 'inherit-font-style' },
			/**
			 * ADVANCED: Force the internal tooltip to open in a certain direction. If no position is provided, the tooltip will open in the first position that has enough space for it in the order: bottom, top, right, left.
			 * @type {'top'|'bottom'|'left'|'right'}
			 */
			position: { type: String },
			/**
			 * @ignore
			 */
			showing: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Text that will render as the Help Tooltip opener
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return [super.styles, bodySmallStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			#d2l-tooltip-help-text {
				background: none;
				border: none;
				cursor: inherit;
				font-family: inherit;
				padding: 0;
				text-decoration-line: underline;
				text-decoration-style: dashed;
				text-decoration-thickness: 1px;
				text-underline-offset: 0.1rem;
			}
			#d2l-tooltip-help-text:focus {
				outline-style: none;
			}
			#d2l-tooltip-help-text:${unsafeCSS(getFocusPseudoClass())} {
				border-radius: 0.05rem;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 0.05rem;
				text-underline-offset: 0.1rem;
			}
			:host([inherit-font-style]) #d2l-tooltip-help-text {
				color: inherit;
				font-size: inherit;
				font-weight: inherit;
				letter-spacing: inherit;
				line-height: inherit;
				margin: inherit;
			}
			d2l-tooltip {
				cursor: text;
			}
			:host([skeleton-display]) #d2l-tooltip-help-text.d2l-skeletize {
				text-decoration: none;
			}
		`];
	}

	constructor() {
		super();

		this.inheritFontStyle = false;
		this.showing = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.text || this.text.length === 0) {
			console.warn('Help Tooltip component requires text.');
		}
	}

	render() {
		const classes = {
			'd2l-body-small': !this.inheritFontStyle,
			'd2l-skeletize': true
		};
		return html`
			<button id="d2l-tooltip-help-text" class="${classMap(classes)}" type="button">
				${this.text}
			</button>
			${!this.skeleton ? html`
				<d2l-tooltip for="d2l-tooltip-help-text" delay="0" offset="13" position="${ifDefined(this.position)}" ?showing="${this.showing}">
					<slot></slot>
				</d2l-tooltip>
			` : nothing }
		`;
	}

}
customElements.define('d2l-tooltip-help', TooltipHelp);
