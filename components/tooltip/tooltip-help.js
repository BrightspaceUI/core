import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';

const KEYCODE_SPACE = 32;

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
			}
			:host([hidden]) {
				display: none;
			}
			#d2l-tooltip-help-text {
				font-size: inherit;
				text-decoration-color: var(--d2l-color-galena);
				text-decoration-line: underline;
				text-decoration-style: dashed;
				text-decoration-thickness: 1px;
				text-underline-offset: 0.15rem;
			}
			#d2l-tooltip-help-text:focus {
				outline-style: none;
			}
			#d2l-tooltip-help-text.focus-visible {
				border-radius: 0.025rem;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 0.05rem;
				text-underline-offset: 0.05rem;
			}
		`];
	}

	static get focusElementSelector() {
		return 'span';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.text || this.text.length === 0) {
			console.warn('Help Tooltip component requires text.');
		}
	}

	render() {
		// 				class="d2l-body-small"
		return html`
			<span 
				id="d2l-tooltip-help-text" 

				@keydown="${this._handleKeyDown}"
				role="button" 
				tabindex="0" >
				${this.text}
			</span>
			<d2l-tooltip class="help-tooltip" for="d2l-tooltip-help-text" delay=0 offset=13>
				<slot></slot>
			</d2l-tooltip>
		`;
	}

	_handleKeyDown(event) {
		if (event.keyCode === KEYCODE_SPACE) {
			event.preventDefault();
		}
	}

}
customElements.define('d2l-tooltip-help', HelpTooltip);
