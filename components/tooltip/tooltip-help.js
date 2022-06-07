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
			 * REQUIRED: Text that will render as the Help Tooltip opener
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			:host {
				display: inline-block;
				color: var(--d2l-color-tungsten);
				font-size: 0.7rem;
				font-weight: 400;
				line-height: 1rem;
				margin: auto;
			}
			:host([hidden]) {
				display: none;
			}
			#d2l-tooltip-help-text {
				background: none;
				border: none;
				color: inherit;
				font-size: inherit;
				padding: 0;
				text-decoration-color: var(--d2l-color-galena);
				text-decoration-line: underline;
				text-decoration-style: dashed;
				text-decoration-thickness: 1px;
				text-underline-offset: 0.075rem;
			}
			#d2l-tooltip-help-text:focus {
				outline-style: none;
			}
			#d2l-tooltip-help-text.focus-visible {
				border-radius: 0.05rem;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 0.1rem;
				text-underline-offset: 0.075rem;
			}
		`];
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
		return html`
			<button id="d2l-tooltip-help-text" class="d2l-body-small">
				${this.text}
			</button>
			<d2l-tooltip class="help-tooltip" for="d2l-tooltip-help-text" delay=0 offset=13>
				<slot></slot>
			</d2l-tooltip>
		`;
	}

}
customElements.define('d2l-tooltip-help', HelpTooltip);
