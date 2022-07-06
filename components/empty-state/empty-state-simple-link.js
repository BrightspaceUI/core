import '../link/link.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * The `d2l-empty-state-simple-link` component is an empty state component that displays a description and action link.
 */
class EmptyStateSimpleLink extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {String}
			 */
			description: { type: String },
			/**
			 * Optional: The action text to be used in the link
			 * @type {String}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * Optional: The action URL or URL fragment of the link
			 * @type {String}
			 */
			actionHref: { type: String, attribute: 'action-href' }
		};
	}

	static get styles() {
		return [emptyStateStyles, emptyStateSimpleStyles];
	}

	render() {
		return html`
			<p>${this.description}</p>
			${this.actionText && html`<d2l-link href=${this.actionHref} small>${this.actionText}</d2l-link>`}
		`;
	}

}

customElements.define('d2l-empty-state-simple-link', EmptyStateSimpleLink);
