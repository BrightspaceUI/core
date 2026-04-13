import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { getFocusRingStyles } from '../../helpers/focus.js';

const overlayStyles = css`
	.action-slot::slotted(*) {
		display: inline;
	}
	:host {
		align-items: center;
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.3rem;
		column-gap: 0.75rem;
		display: block;
		display: flex;
		flex-wrap: wrap;
		padding: 1.2rem 1.5rem;
	}

	.d2l-backdrop-dirty-overlay {
		--d2l-focus-ring-offset: 3px;
		border-radius: 0.3rem;
		margin: 0;
	}

	.d2l-backdrop-dirty-overlay-action {
		vertical-align: top;
	}
`;

/**
 * The `d2l-backdrop-dirty-overlay` component is used to render a dialog with text and an action over another element that needs to be refreshed after user input.
 */
class BackdropDirtyOverlay extends LitElement {

	static get properties() {
		return {
			/**
			 * The text displayed on the dirty state overlay.
			 * @type {string}
			 */
			description: { type: String, required: true },

			/**
			 * The text displayed on the button of the dirty state overlay when the 'dirty' dataState is set.
			 * @type {string}
			 */
			action: { type: String, required: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, overlayStyles, getFocusRingStyles('.d2l-backdrop-dirty-overlay')];
	}

	render() {
		return html`
			<p class="d2l-body-compact d2l-backdrop-dirty-overlay" tabindex="-1">${this.description}</p>
			<d2l-button-subtle
				class="d2l-backdrop-dirty-overlay-action"
				@click=${this._handleActionClick}
				h-align="text"
				text=${this.action}>
			</d2l-button-subtle>
		`;
	}
	_handleActionClick(e) {
		e.stopPropagation();

		/** Dispatched when the action button on the overlay is clicked */
		this.dispatchEvent(new CustomEvent('d2l-backdrop-dirty-overlay-action', { bubbles: true, composed: true }));
	}

}

customElements.define('d2l-backdrop-dirty-overlay', BackdropDirtyOverlay);
