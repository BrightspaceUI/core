import '../colors/colors.js';
import '../button/button-subtle.js';
import '../link/link.js';
import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * ADD DESCRIPTION HERE
 * @slot - You can place your own custom action component in lieu of the actionText property. The component in the slot will only render if actionText is not defined. Only a d2l-button-subtle or d2l-link component will render in this slot.
 * @fires d2l-empty-state-action - Dispatched when the action button is clicked
 */
class EmptyStateText extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {String}
			 */
			description: { type: String },
			/**
			 * Optional: The action text to be used in the subtle button
			 * @type {String}
			 */
			actionText: { type: String, attribute: 'action-text' }
		};
	}

	static get styles() {
		return css`
			:host {
				border: 1px solid var(--d2l-color-mica);
				border-radius: 6px;
				display: block;
				padding: 1.2rem 1.5rem;
			}
			:host([dir="rtl"]) span {
				padding-left: 0.5rem;
				padding-right: 0;
			}
			:host([hidden]),
			::slotted(*) {
				display: none;
			}
			::slotted(d2l-button-subtle:first-child),
			::slotted(d2l-link:first-child) {
				display: inline;
			}
			p {
				display: inline;
				font-size: 0.7rem;
				line-height: 1rem;
				padding-right: 0.5rem;
			}
		`;
	}

	render() {
		return html`
			<p>${this.description}</p>
			${this.actionText ? html`<d2l-button-subtle @click=${this._handleActionClick} text=${this.actionText}  h-align="text"></d2l-button-subtle>` : html`<slot></slot>`}
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}

}

customElements.define('d2l-empty-state-text', EmptyStateText);
