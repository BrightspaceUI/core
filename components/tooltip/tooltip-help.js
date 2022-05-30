import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';

/**
 * A component used to display additional information when users focus or hover on certain text.
 * @slot - Default content placed inside of the tooltip
 * @fires d2l-tooltip-show - Dispatched when the tooltip is opened
 * @fires d2l-tooltip-hide - Dispatched when the tooltip is closed
 */
class HelpTooltip extends FocusVisiblePolyfillMixin(LitElement) {

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
				text-underline-offset: .15rem;
				/*//! Remove the below if we're going with a span and not a button */
                padding: 0; 
                border: none;
                background: none;
                font-family: inherit;
			}
			#d2l-tooltip-help-text:focus-visible {
				text-decoration: none;
				border: 2px solid var(--d2l-color-celestine);
				border-radius: .2rem;
			}
			#d2l-tooltip-help-text:focus {
 				outline: none;
			}
		`];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.text || this.text.length === 0) {
			console.warn('Help Tooltip component requires accessible text.');
		}
	}

	render() {
		return html`
            <button id="d2l-tooltip-help-text" class="d2l-body-small">${this.text}</button>
            <d2l-tooltip class="help-tooltip" for="d2l-tooltip-help-text" delay=0>
                <slot></slot>
            </d2l-tooltip>
		`;
	}

}
customElements.define('d2l-tooltip-help', HelpTooltip);
