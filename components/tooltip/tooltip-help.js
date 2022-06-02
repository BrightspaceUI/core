import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';

/**
 * A component used to display additional information when users focus or hover on certain text.
 * @slot - Default content placed inside of the tooltip
 * @fires d2l-tooltip-show - Dispatched when the tooltip is opened
 * @fires d2l-tooltip-hide - Dispatched when the tooltip is closed
 */
class HelpTooltip extends FocusMixin(FocusVisiblePolyfillMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: The text that will be rendered as the Help Tooltip component.
			 * @type {String}
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
                text-decoration: dashed underline var(--d2l-color-galena) 1px;
				text-underline-offset: 0.15rem;
			}
			#d2l-tooltip-help-text:focus-visible {
				outline: 2px solid var(--d2l-color-celestine);
				border-radius: 0.025rem;
				outline-offset: 0.15rem;
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
			<span 
				id="d2l-tooltip-help-text" 
				class="d2l-body-small"
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
		if (event.defaultPrevented) {
			return;
		}

		const SPACE_KEYCODE = 32;
		if (event.keyCode === SPACE_KEYCODE) {
			event.preventDefault();
		}
	}

}
customElements.define('d2l-tooltip-help', HelpTooltip);
