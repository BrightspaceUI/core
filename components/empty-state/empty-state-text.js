import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';

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
		return css``;
	}

	connectedCallback() {
		super.connectedCallback();
		// Add event listener
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		// Remove event listener
	}

	render() {
		// What if given empty string????
		if (this.actionText) {
			return html`
				<div>
					<span>${this.description}</span>
					<d2l-button-subtle>${this.actionText}</d2l-button-subtle>
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
	}
}

customElements.define('d2l-empty-state-text', EmptyStateText);
