import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';

/**
 * A component to render as an overlay over another element with stale data.
 */
class BackdropStaleOverlay extends LitElement {

	static properties = {
		/**
		 * The action button text
		 * @type {string}
		 */
		buttonText: { type: String, attribute: 'button-text', required: true },
		/**
		 * The text displayed on the overlay
		 * @type {string}
		 */
		text: { type: String, required: true }
	};

	static styles = [bodyCompactStyles, css`
		:host {
			align-items: center;
			border: 1px solid var(--d2l-color-mica);
			border-radius: 0.3rem;
			column-gap: 0.75rem;
			display: flex;
			flex-wrap: wrap;
			padding: 1.2rem 1.5rem;
		}
	`];

	render() {
		return html`
			<p class="d2l-body-compact">${this.text}</p>
			<d2l-button-subtle
				@click="${this.#handleActionClick}"
				text="${this.buttonText}">
			</d2l-button-subtle>
		`;
	}

	#handleActionClick(e) {
		e.stopPropagation();

		/** Dispatched when the action button on the overlay is clicked */
		this.dispatchEvent(new CustomEvent('d2l-backdrop-stale-overlay-action', { bubbles: true, composed: true }));
	}

}

customElements.define('d2l-backdrop-stale-overlay', BackdropStaleOverlay);
