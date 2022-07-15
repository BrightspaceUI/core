import '../link/link.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
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
		return [bodyCompactStyles, emptyStateStyles, emptyStateSimpleStyles];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.description || this.description.length === 0) {
			console.warn('d2l-empty-state-simple-link component requires a description.');
		}
	}

	render() {
		const actionLink = this.actionText && this.actionHref
			? html`<d2l-link class="d2l-body-compact" href=${this.actionHref}>${this.actionText}</d2l-link>`
			: nothing;

		return html`
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionLink}
		`;
	}

}

customElements.define('d2l-empty-state-simple-link', EmptyStateSimpleLink);
