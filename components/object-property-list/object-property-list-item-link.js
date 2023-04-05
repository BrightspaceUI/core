import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { linkStyles } from '../link/link.js';
import { ObjectPropertyListItem } from './object-property-list-item.js';

/**
 * A single object property, to be used within an object-property-list,
 * rendered as a link and with an optional icon.
 */
class ObjectPropertyListItemLink extends FocusMixin(ObjectPropertyListItem) {
	static get properties() {
		return {
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
			linkStyles
		];
	}

	static get focusElementSelector() {
		return '.d2l-link';
	}

	render() {
		return html`
			${this._renderIcon()}
			${!this.skeleton ? html`
				<a
					?download="${this.download}"
					class="d2l-link"
					href="${ifDefined(this.href)}"
					target="${ifDefined(this.target)}"
				>
					${this._renderText()}
				</a>
			` : this._renderText()}
			${this._renderSeparator()}
		`;
	}
}

customElements.define('d2l-object-property-list-item-link', ObjectPropertyListItemLink);
