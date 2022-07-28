import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { linkStyles } from '../link/link.js';

/**
 * `d2l-empty-state-action-link` is an empty state action component that can be placed inside of the default slot of `empty-state-simple` or `empty-state-illustrated` to add a link action to the component.
 */
class EmptyStateActionLink extends LitElement {

	static get properties() {
		return {
			/**
			 * REQUIRED: The action text to be used in the subtle button
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * REQUIRED: The action URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String },
		};
	}

	static get styles() {
		return [bodyCompactStyles, linkStyles];
	}

	constructor() {
		super();
		this._missingHrefErrorHasBeenThrown = false;
		this._missingTextErrorHasBeenThrown = false;
		this._validatingAttributesTimeout = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._validateAttributes();
	}

	render() {
		const actionLink = this.text && this.href
			? html`
				<a class="d2l-body-compact d2l-link" href=${this.href}>${this.text}</a>`
			: nothing;

		return html`${actionLink}`;
	}

	_validateAttributes() {
		clearTimeout(this._validatingAttributesTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingAttributesTimeout = setTimeout(() => {
			this._validatingAttributesTimeout = null;

			const hasHref = (typeof this.href === 'string') && this.href.length > 0;
			const hasText = (typeof this.text === 'string') && this.text.length > 0;

			if (!hasHref && !this._missingHrefErrorHasBeenThrown) {
				this._missingHrefErrorHasBeenThrown = true;
				setTimeout(() => { throw new Error('<d2l-empty-state-action-link>: missing required "href" attribute.'); });
			}

			if (!hasText && !this._missingTextErrorHasBeenThrown) {
				this._missingTextErrorHasBeenThrown = true;
				setTimeout(() => { throw new Error('<d2l-empty-state-action-link>: missing required "text" attribute.'); });
			}
		}, 3000);
	}

}

customElements.define('d2l-empty-state-action-link', EmptyStateActionLink);
