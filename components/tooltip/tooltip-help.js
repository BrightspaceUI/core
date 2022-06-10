import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';

/**
 * A component used to display additional information when users focus or hover over some text.
 * @slot - Default content placed inside of the tooltip
 */
class HelpTooltip extends FocusMixin(FocusVisiblePolyfillMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * ADVANCED: Allows this component to inherit certain font properties
			 * @type {boolean}
			 */
			inheritFontStyle: { type: Boolean, attribute: 'inherit-font-style' },
			/**
			 * REQUIRED: Text that will render as the Help Tooltip opener
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			:host {
				display: inline;
			}
			:host([hidden]) {
				display: none;
			}
			#d2l-tooltip-help-text {
				background: none;
				border: none;
				padding: 0;
				text-decoration-color: var(--d2l-color-galena);
				text-decoration-line: underline;
				text-decoration-style: dashed;
				text-decoration-thickness: 1px;
				text-underline-offset: 0.1rem;
			}
			#d2l-tooltip-help-text:focus {
				outline-style: none;
			}
			#d2l-tooltip-help-text.focus-visible {
				border-radius: 0.05rem;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 0.05rem;
				text-underline-offset: 0.1rem;
			}
			.inherit-font {
				color: inherit;
				font-size: inherit;
				font-weight: inherit;
				line-height: inherit;
			}
		`];
	}

	constructor() {
		super();

		this.inheritFontStyle = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const opener = this.shadowRoot.querySelector('#d2l-tooltip-help-text');
		if (this.inheritFontStyle) {
			opener.classList.add('inherit-font');
		} else {
			opener.classList.add('d2l-body-small');
		}

		if (!this.text || this.text.length === 0) {
			console.warn('Help Tooltip component requires text.');
		}
	}

	render() {
		return html`
			<button id="d2l-tooltip-help-text">
				${this.text}
			</button>
			<d2l-tooltip for="d2l-tooltip-help-text" delay=0 offset=13>
				<slot></slot>
			</d2l-tooltip>
		`;
	}

}
customElements.define('d2l-tooltip-help', HelpTooltip);
