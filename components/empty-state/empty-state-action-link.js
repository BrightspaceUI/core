import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { linkStyles } from '../link/link.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * `d2l-empty-state-action-link` is an empty state action component that can be placed inside of the default slot of `empty-state-simple` or `empty-state-illustrated` to add a link action to the component.
 */
class EmptyStateActionLink extends PropertyRequiredMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: The action text to be used in the subtle button
			 * @type {string}
			 */
			text: { type: String, required: true },
			/**
			 * REQUIRED: The action URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String, required: true },
		};
	}

	static get styles() {
		return [bodyCompactStyles, linkStyles];
	}

	render() {
		const actionLink = this.text && this.href
			? html`
				<a class="d2l-body-compact d2l-link" href=${this.href}>${this.text}</a>`
			: nothing;

		return html`${actionLink}`;
	}

}

customElements.define('d2l-empty-state-action-link', EmptyStateActionLink);
