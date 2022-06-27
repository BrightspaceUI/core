import '../colors/colors.js';
import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { bodyStandardStyles } from '../typography/styles.js';

class EmptyStateText extends LitElement {

	static get properties() {
		return {
			/**
			 * A description to be added to the button for accessib
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
		return [bodyStandardStyles, css`
			div {
				border: 1px solid var(--d2l-color-mica);
				border-radius: 6px;
				padding: 1.2rem 1.5rem;
			}
			d2l-button-subtle {
				margin-top: 1px;
			}
			:host([dir="rtl"]) span {
				padding-left: 0.5rem;
				padding-right: 0;
			}
			::slotted(*) {
				visibility: hidden;
			}
			::slotted(d2l-button-subtle:first-child),
			::slotted(d2l-link:first-child) {
				visibility: visible;
			}
			span {
				padding-right: 0.5rem;
				font-size:0.7rem;
			}
		`];
	}

	render() {
		if (this.actionText !== undefined) {
			return html`
				<div>
					<span>${this.description}</span>
					<d2l-button-subtle @click=${this._handleActionClick} text=${this.actionText}  h-align="text"></d2l-button-subtle>
				</div>
			`;
		}
		else {
			return html`
				<div>
					<span>${this.description}</span>
					<slot></slot>
				</div>
			`;
		}
	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent(
			'd2l-empty-state-action',
			{ bubbles: true })
		);
	}
}

customElements.define('d2l-empty-state-text', EmptyStateText);
