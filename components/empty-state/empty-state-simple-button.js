import '../button/button-subtle.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * The `d2l-empty-state-simple-button` component is an empty state component that displays a description and action button.
 * @fires d2l-empty-state-action - Dispatched when the action button is clicked
 */
class EmptyStateSimpleButton extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Optional: The action text to be used in the subtle button
			 * @type {string}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String },
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateSimpleStyles];
	}

	constructor() {
		super();
		this._missingDescriptionErrorHasBeenThrown =  false;
		this._validatingDescriptionTimeout = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._validateDescription();
	}

	render() {
		const actionButton = this.actionText
			? html`<d2l-button-subtle class="d2l-empty-state-action" @click=${this._handleActionClick}  h-align="text" text=${this.actionText}></d2l-button-subtle>`
			: nothing;

		return html`
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionButton}
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}

	_validateDescription() {
		clearTimeout(this._validatingDescriptionTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingDescriptionTimeout = setTimeout(() => {
			this._validatingDescriptionTimeout = null;
			const hasDescription = (typeof this.description === 'string') && this.description.length > 0;

			if (!hasDescription && !this._missingDescriptionErrorHasBeenThrown) {
				this._missingDescriptionErrorHasBeenThrown = true;
				setTimeout(() => { throw new Error('<d2l-empty-state-simple-button>: missing required "description" attribute.'); });
			}
		}, 3000);
	}

}

customElements.define('d2l-empty-state-simple-button', EmptyStateSimpleButton);
