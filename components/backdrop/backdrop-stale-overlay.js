import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A component to render as an overlay over another element with stale data.
 */
class BackdropStaleOverlay extends LocalizeCoreElement(LitElement) {

	static properties = {
		/**
		 * The action button text
		 * @type {string}
		 */
		buttonText: { type: String, attribute: 'button-text' },
		/**
		 * The text displayed on the overlay
		 * @type {string}
		 */
		text: { type: String }
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
		const message = this.text || this.localize('components.backdrop-stale-overlay.message');
		const buttonText = this.buttonText || this.localize('intl-common:actions:reload');;

		return html`
			<p class="d2l-body-compact">${message}</p>
			<d2l-button-subtle
				@click="${this.#handleActionClick}"
				text="${buttonText}">
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
