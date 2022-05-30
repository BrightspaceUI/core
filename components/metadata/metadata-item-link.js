import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { linkStyles } from '../link/link.js';
import { MetadataItem } from './metadata-item.js';

/**
 * A placeholder.
 */
class MetadataItemLink extends MetadataItem {
	static properties = {
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

	static styles = [
		...super.styles,
		linkStyles,
	];

	render() {
		return html`
			<a
				?download="${this.download}"
				class="d2l-link"
				href="${ifDefined(this.href)}"
				target="${ifDefined(this.target)}"
			>
				${this.text}
			</a>
			${this.renderSeparator()}
		`;
	}
}

customElements.define('d2l-metadata-item-link', MetadataItemLink);
