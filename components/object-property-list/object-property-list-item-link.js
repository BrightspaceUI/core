import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { linkStyles } from '../link/link.js';
import { ObjectPropertyListItem } from './object-property-list-item.js';
import { trimWhitespace } from './trimWhitespace.js';

/**
 * A placeholder.
 */
class ObjectPropertyListItemLink extends ObjectPropertyListItem {
	static get properties() {
		return {
			...super.properties,

			/**
			 * Download a URL instead of navigating to it
			 * @type {boolean}
			 */
			download: { type: Boolean },
			/**
			 * REQUIRED: URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String },
		};
	}

	static get styles() {
		return [
			...super.styles,
			linkStyles,
		];
	}

	render() {
		return html`${trimWhitespace()}
			${this._renderIcon()}
			<a
				?download="${this.download}"
				class="d2l-link"
				href="${ifDefined(this.href)}"
				target="${ifDefined(this.target)}"
			>
				${this.text}
			</a>
			${this._renderSeparator()}
		`;
	}
}

customElements.define('d2l-object-property-list-item-link', ObjectPropertyListItemLink);
