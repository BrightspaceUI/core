import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { linkStyles } from '../link/link.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * The `d2l-empty-state-simple-link` component is an empty state component that displays a description and action link.
 */
class EmptyStateSimpleLink extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Optional: The action URL or URL fragment of the link
			 * @type {string}
			 */
			actionHref: { type: String, attribute: 'action-href' },
			/**
			 * Optional: The action text to be used in the link
			 * @type {string}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String }
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateSimpleStyles, linkStyles];
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
		const actionLink = this.actionText && this.actionHref
			? html`<a class="d2l-body-compact d2l-link" href=${this.actionHref}>${this.actionText}</a>`
			: nothing;

		return html`
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionLink}
		`;
	}

	_validateDescription() {
		clearTimeout(this._validatingDescriptionTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingDescriptionTimeout = setTimeout(() => {
			this._validatingDescriptionTimeout = null;
			const hasDescription = (typeof this.description === 'string') && this.description.length > 0;

			if (!hasDescription && !this._missingDescriptionErrorHasBeenThrown) {
				this._missingDescriptionErrorHasBeenThrown = true;
				setTimeout(() => { throw new Error('<d2l-empty-state-simple-link>: missing required "description" attribute.'); });
			}
		}, 3000);
	}

}

customElements.define('d2l-empty-state-simple-link', EmptyStateSimpleLink);
